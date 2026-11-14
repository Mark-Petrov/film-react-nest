import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Film } from './entities/film';
import { Schedule } from './entities/schedule';
import { FilmEntity, ScheduleEntity, StoredOrder } from './film.entity';
import { FilmsRepository } from './films.repository';

function parseList(value: string | null | undefined): string[] {
  if (!value) {
    return [];
  }
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function toSchedule(schedule: Schedule): ScheduleEntity {
  return {
    id: schedule.id,
    daytime: schedule.daytime,
    hall: schedule.hall,
    rows: schedule.rows,
    seats: schedule.seats,
    price: schedule.price,
    taken: parseList(schedule.taken),
  };
}

function toFilm(film: Film): FilmEntity {
  const schedule = [...(film.schedule ?? [])].sort((a, b) =>
    a.daytime.localeCompare(b.daytime),
  );

  return {
    id: film.id,
    rating: film.rating,
    director: film.director,
    tags: parseList(film.tags),
    title: film.title,
    about: film.about,
    description: film.description,
    image: film.image,
    cover: film.cover,
    schedule: schedule.map(toSchedule),
  };
}

@Injectable()
export class FilmsPostgresRepository implements FilmsRepository {
  constructor(
    @InjectRepository(Film)
    private readonly films: Repository<Film>,
    @InjectRepository(Schedule)
    private readonly schedules: Repository<Schedule>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<FilmEntity[]> {
    const films = await this.films.find();
    return films.map(toFilm);
  }

  async findById(id: string): Promise<FilmEntity | null> {
    const film = await this.films.findOne({
      where: { id },
      relations: { schedule: true },
    });
    return film ? toFilm(film) : null;
  }

  async takeSeats(
    filmId: string,
    sessionId: string,
    places: string[],
  ): Promise<boolean> {
    return this.dataSource.transaction(async (manager) => {
      const schedule = await manager
        .withRepository(this.schedules)
        .createQueryBuilder('schedule')
        .setLock('pessimistic_write')
        .where('schedule.id = :sessionId', { sessionId })
        .andWhere('schedule."filmId" = :filmId', { filmId })
        .getOne();

      if (!schedule) {
        return false;
      }

      const taken = parseList(schedule.taken);
      if (places.some((place) => taken.includes(place))) {
        return false;
      }

      schedule.taken = [...taken, ...places].join(',');
      await manager.save(schedule);
      return true;
    });
  }

  async releaseSeats(
    filmId: string,
    sessionId: string,
    places: string[],
  ): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const schedule = await manager
        .withRepository(this.schedules)
        .createQueryBuilder('schedule')
        .setLock('pessimistic_write')
        .where('schedule.id = :sessionId', { sessionId })
        .andWhere('schedule."filmId" = :filmId', { filmId })
        .getOne();

      if (!schedule) {
        return;
      }

      const drop = new Set(places);
      schedule.taken = parseList(schedule.taken)
        .filter((place) => !drop.has(place))
        .join(',');
      await manager.save(schedule);
    });
  }

  async saveOrder(order: StoredOrder): Promise<void> {
    void order;
  }
}
