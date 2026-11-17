import { Film } from './entities/film';

export const FILMS_REPOSITORY = 'FILMS_REPOSITORY';

export interface FilmsRepository {
  findAll(): Promise<Film[]>;
  findById(id: string): Promise<Film | null>;
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
}
