import { FilmEntity, StoredOrder } from './film.entity';

export const FILMS_REPOSITORY = 'FILMS_REPOSITORY';

export interface FilmsRepository {
  findAll(): Promise<FilmEntity[]>;
  findById(id: string): Promise<FilmEntity | null>;
  takeSeats(
    filmId: string,
    sessionId: string,
    places: string[],
  ): Promise<boolean>;
  releaseSeats(
    filmId: string,
    sessionId: string,
    places: string[],
  ): Promise<void>;
  saveOrder(order: StoredOrder): Promise<void>;
}
