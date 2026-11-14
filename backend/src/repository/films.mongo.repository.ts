import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilmEntity, StoredOrder } from './film.entity';
import { FilmsRepository } from './films.repository';
import { Film, Order } from './schemas/film.schema';

@Injectable()
export class FilmsMongoRepository implements FilmsRepository {
  constructor(
    @InjectModel(Film.name) private readonly filmModel: Model<Film>,
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
  ) {}

  async findAll(): Promise<FilmEntity[]> {
    return this.filmModel.find().lean().exec();
  }

  async findById(id: string): Promise<FilmEntity | null> {
    return this.filmModel.findOne({ id }).lean().exec();
  }

  async takeSeats(
    filmId: string,
    sessionId: string,
    places: string[],
  ): Promise<boolean> {
    const updated = await this.filmModel
      .findOneAndUpdate(
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
      )
      .exec();

    return Boolean(updated);
  }

  async releaseSeats(
    filmId: string,
    sessionId: string,
    places: string[],
  ): Promise<void> {
    await this.filmModel
      .updateOne(
        { id: filmId, 'schedule.id': sessionId },
        { $pull: { 'schedule.$.taken': { $in: places } } },
      )
      .exec();
  }

  async saveOrder(order: StoredOrder): Promise<void> {
    await this.orderModel.create(order);
  }
}
