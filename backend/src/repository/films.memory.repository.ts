import { Injectable } from '@nestjs/common';
import { readFileSync } from 'node:fs';
import * as path from 'node:path';
import { FilmEntity, StoredOrder } from './film.entity';
import { FilmsRepository } from './films.repository';

@Injectable()
export class FilmsMemoryRepository implements FilmsRepository {
  private readonly films: FilmEntity[];
  private readonly orders: StoredOrder[] = [];

  constructor() {
    const filePath = path.join(
      process.cwd(),
      'test',
      'mongodb_initial_stub.json',
    );
    this.films = JSON.parse(readFileSync(filePath, 'utf-8')) as FilmEntity[];
  }

  async findAll(): Promise<FilmEntity[]> {
    return this.films.map((film) => structuredClone(film));
  }

  async findById(id: string): Promise<FilmEntity | null> {
    const film = this.films.find((item) => item.id === id);
    return film ? structuredClone(film) : null;
  }

  async takeSeats(
    filmId: string,
    sessionId: string,
    places: string[],
  ): Promise<boolean> {
    const film = this.films.find((item) => item.id === filmId);
    const session = film?.schedule.find((item) => item.id === sessionId);
    if (!session) {
      return false;
    }
    if (places.some((place) => session.taken.includes(place))) {
      return false;
    }
    session.taken.push(...places);
    return true;
  }

  async releaseSeats(
    filmId: string,
    sessionId: string,
    places: string[],
  ): Promise<void> {
    const film = this.films.find((item) => item.id === filmId);
    const session = film?.schedule.find((item) => item.id === sessionId);
    if (!session) {
      return;
    }
    session.taken = session.taken.filter((place) => !places.includes(place));
  }

  async saveOrder(order: StoredOrder): Promise<void> {
    this.orders.push(order);
  }
}
