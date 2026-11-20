import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

describe('FilmsController', () => {
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

  it('returns the film list from the service', async () => {
    const films = { total: 1, items: [{ id: 'film-1', title: 'Фильм' }] };
    filmsService.findAll.mockResolvedValue(films);

    await expect(controller.getFilms()).resolves.toBe(films);
    expect(filmsService.findAll).toHaveBeenCalledTimes(1);
  });

  it('returns a schedule for the given film id', async () => {
    const schedule = { total: 0, items: [] };
    filmsService.findSchedule.mockResolvedValue(schedule);

    await expect(controller.getSchedule('film-1')).resolves.toBe(schedule);
    expect(filmsService.findSchedule).toHaveBeenCalledWith('film-1');
  });
});
