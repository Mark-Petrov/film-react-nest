import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import {
  CreateOrderDto,
  OrderResponseDto,
  OrderTicketDto,
} from './dto/order.dto';
import {
  FILMS_REPOSITORY,
  FilmsRepository,
} from '../repository/films.repository';

interface SeatGroup {
  filmId: string;
  sessionId: string;
  places: string[];
}

@Injectable()
export class OrderService {
  constructor(
    @Inject(FILMS_REPOSITORY)
    private readonly filmsRepository: FilmsRepository,
  ) {}

  async create(dto: CreateOrderDto): Promise<OrderResponseDto> {
    const tickets = dto?.tickets ?? [];
    if (tickets.length === 0) {
      throw new HttpException(
        { error: 'Билеты не переданы' },
        HttpStatus.BAD_REQUEST,
      );
    }

    this.assertUniqueSeats(tickets);

    const groups = this.groupTickets(tickets);
    for (const group of groups) {
      await this.assertSeatsAvailable(group);
    }

    const booked: SeatGroup[] = [];
    try {
      for (const group of groups) {
        const reserved = await this.filmsRepository.takeSeats(
          group.filmId,
          group.sessionId,
          group.places,
        );
        if (!reserved) {
          throw new HttpException(
            { error: 'Место уже занято' },
            HttpStatus.BAD_REQUEST,
          );
        }
        booked.push(group);
      }
    } catch (error) {
      await this.rollback(booked);
      throw error;
    }

    const items: OrderTicketDto[] = tickets.map((ticket) => ({
      id: randomUUID(),
      film: ticket.film,
      session: ticket.session,
      daytime: ticket.daytime,
      row: ticket.row,
      seat: ticket.seat,
      price: ticket.price,
    }));

    await this.filmsRepository.saveOrder({
      email: dto.email,
      phone: dto.phone,
      tickets: items,
    });

    return { total: items.length, items };
  }

  private assertUniqueSeats(tickets: CreateOrderDto['tickets']) {
    const seen = new Set<string>();
    for (const ticket of tickets) {
      const key = `${ticket.film}:${ticket.session}:${ticket.row}:${ticket.seat}`;
      if (seen.has(key)) {
        throw new HttpException(
          { error: 'Место уже занято' },
          HttpStatus.BAD_REQUEST,
        );
      }
      seen.add(key);
    }
  }

  private groupTickets(tickets: CreateOrderDto['tickets']): SeatGroup[] {
    const groups = new Map<string, SeatGroup>();
    for (const ticket of tickets) {
      const key = `${ticket.film}:${ticket.session}`;
      const group = groups.get(key) ?? {
        filmId: ticket.film,
        sessionId: ticket.session,
        places: [],
      };
      group.places.push(`${ticket.row}:${ticket.seat}`);
      groups.set(key, group);
    }
    return [...groups.values()];
  }

  private async assertSeatsAvailable(group: SeatGroup) {
    const film = await this.filmsRepository.findById(group.filmId);
    if (!film) {
      throw new HttpException(
        { error: 'Фильм не найден' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const session = film.schedule.find((item) => item.id === group.sessionId);
    if (!session) {
      throw new HttpException(
        { error: 'Сеанс не найден' },
        HttpStatus.BAD_REQUEST,
      );
    }

    for (const place of group.places) {
      const [row, seat] = place.split(':').map(Number);
      const outOfRange =
        row < 1 || row > session.rows || seat < 1 || seat > session.seats;
      if (outOfRange) {
        throw new HttpException(
          { error: 'Некорректное место' },
          HttpStatus.BAD_REQUEST,
        );
      }
      if (session.taken.includes(place)) {
        throw new HttpException(
          { error: 'Место уже занято' },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  private async rollback(groups: SeatGroup[]) {
    for (const group of groups) {
      await this.filmsRepository.releaseSeats(
        group.filmId,
        group.sessionId,
        group.places,
      );
    }
  }
}
