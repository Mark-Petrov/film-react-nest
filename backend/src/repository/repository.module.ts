import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigModule } from '../app-config.module';
import { FilmsMemoryRepository } from './films.memory.repository';
import { FilmsMongoRepository } from './films.mongo.repository';
import { FILMS_REPOSITORY } from './films.repository';
import { Film, FilmSchema, Order, OrderSchema } from './schemas/film.schema';

const useMongo = process.env.DATABASE_DRIVER === 'mongodb';

@Module({
  imports: [
    AppConfigModule,
    ...(useMongo
      ? [
          MongooseModule.forFeature([
            { name: Film.name, schema: FilmSchema },
            { name: Order.name, schema: OrderSchema },
          ]),
        ]
      : []),
  ],
  providers: [
    {
      provide: FILMS_REPOSITORY,
      useClass: useMongo ? FilmsMongoRepository : FilmsMemoryRepository,
    },
  ],
  exports: [FILMS_REPOSITORY],
})
export class RepositoryModule {}
