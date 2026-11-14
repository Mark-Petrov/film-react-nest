import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { FilmDto, GetFilmsDto, GetScheduleDto } from './dto/films.dto';
import {
  FILMS_REPOSITORY,
  FilmsRepository,
} from '../repository/films.repository';

@Injectable()
export class FilmsService {
  constructor(
    @Inject(FILMS_REPOSITORY)
    private readonly filmsRepository: FilmsRepository,
  ) {}

  async findAll(): Promise<GetFilmsDto> {
    const films = await this.filmsRepository.findAll();
    const items: FilmDto[] = films.map((film) => ({
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags,
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
    }));

    return { total: items.length, items };
  }

  async findSchedule(id: string): Promise<GetScheduleDto> {
    const film = await this.filmsRepository.findById(id);
    if (!film) {
      throw new HttpException(
        { error: 'Фильм не найден' },
        HttpStatus.NOT_FOUND,
      );
    }

    return { total: film.schedule.length, items: film.schedule };
  }
}
