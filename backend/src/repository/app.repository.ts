import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Film } from './entities/film';
import { Schedule } from './entities/schedule';
import { FilmsRepository } from './films.repository';

@Injectable()
export class AppRepository implements FilmsRepository {
  constructor(
    @InjectRepository(Film)
    private readonly films: Repository<Film>,
    @InjectRepository(Schedule)
    private readonly schedules: Repository<Schedule>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<Film[]> {
    return this.films.find();
  }

  async findById(id: string): Promise<Film | null> {
    const film = await this.films.findOne({
      where: { id },
      relations: { schedule: true },
    });
    if (!film) {
      return null;
    }
    film.schedule.sort((a, b) => a.daytime.localeCompare(b.daytime));
    return film;
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

      const taken = schedule.taken ?? [];
      if (places.some((place) => taken.includes(place))) {
        return false;
      }

      schedule.taken = [...taken, ...places];
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
      schedule.taken = (schedule.taken ?? []).filter(
        (place) => !drop.has(place),
      );
      await manager.save(schedule);
    });
  }
}
