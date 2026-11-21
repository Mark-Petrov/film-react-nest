import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

describe('FilmsController отдаёт фильмы и расписание из сервиса', () => {
  let controller: FilmsController;
  const filmsService = {
    findAll: jest.fn(),
    findSchedule: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [{ provide: FilmsService, useValue: filmsService }],
    }).compile();

    controller = module.get(FilmsController);
    jest.clearAllMocks();
  });

  it('getFilms возвращает список, который собрал FilmsService', async () => {
    const films = { total: 1, items: [{ id: 'film-1', title: 'Фильм' }] };
    filmsService.findAll.mockResolvedValue(films);

    await expect(controller.getFilms()).resolves.toBe(films);
    expect(filmsService.findAll).toHaveBeenCalledTimes(1);
  });

  it('getSchedule возвращает расписание этого фильма', async () => {
    const schedule = { total: 0, items: [] };
    filmsService.findSchedule.mockResolvedValue(schedule);

    await expect(controller.getSchedule('film-1')).resolves.toBe(schedule);
    expect(filmsService.findSchedule).toHaveBeenCalledWith('film-1');
  });
});
