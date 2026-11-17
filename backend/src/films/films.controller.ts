import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { GetFilmsDto, GetScheduleDto } from './dto/films.dto';
import { FilmsService } from './films.service';

const filmIdPipe = new ParseUUIDPipe({
  version: '4',
  exceptionFactory: () =>
    new HttpException(
      { error: 'Некорректный идентификатор' },
      HttpStatus.BAD_REQUEST,
    ),
});

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  getFilms(): Promise<GetFilmsDto> {
    return this.filmsService.findAll();
  }

  @Get(':id/schedule')
  getSchedule(@Param('id', filmIdPipe) id: string): Promise<GetScheduleDto> {
    return this.filmsService.findSchedule(id);
  }
}
