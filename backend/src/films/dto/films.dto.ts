import { Film } from '../../repository/entities/film';
import { Schedule } from '../../repository/entities/schedule';

export type ScheduleDto = Omit<Schedule, 'film'>;

export type FilmDto = Omit<Film, 'schedule'>;

export class GetFilmsDto {
  total!: number;
  items!: FilmDto[];
}

export class GetScheduleDto {
  total!: number;
  items!: ScheduleDto[];
}
