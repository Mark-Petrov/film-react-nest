import { FilmEntity, StoredOrder } from './film.entity';
import { toFilmEntity } from './film.mapper';
import { FilmsRepository } from './films.repository';
import { FilmModel, OrderModel } from './schemas/film.schema';

export class FilmsMongoRepository implements FilmsRepository {
  async findAll(): Promise<FilmEntity[]> {
    const films = await FilmModel.find().lean().exec();
    return films.map((film) =>
      toFilmEntity(film as unknown as Record<string, unknown>),
    );
  }

  async findById(id: string): Promise<FilmEntity | null> {
    const film = await FilmModel.findOne({ id }).lean().exec();
    return film
      ? toFilmEntity(film as unknown as Record<string, unknown>)
      : null;
  }

  async takeSeats(
    filmId: string,
    sessionId: string,
    places: string[],
  ): Promise<boolean> {
    const updated = await FilmModel.findOneAndUpdate(
      {
        id: filmId,
        schedule: {
          $elemMatch: {
            id: sessionId,
            taken: { $nin: places },
          },
        },
      },
      {
        $addToSet: {
          'schedule.$.taken': { $each: places },
        },
      },
      { new: true },
    ).exec();

    return Boolean(updated);
  }

  async releaseSeats(
    filmId: string,
    sessionId: string,
    places: string[],
  ): Promise<void> {
    await FilmModel.updateOne(
      { id: filmId, 'schedule.id': sessionId },
      { $pull: { 'schedule.$.taken': { $in: places } } },
    ).exec();
  }

  async saveOrder(order: StoredOrder): Promise<void> {
    await OrderModel.create(order);
  }
}
