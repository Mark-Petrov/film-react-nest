import { Module } from '@nestjs/common';
import mongoose from 'mongoose';
import { AppConfig, CONFIG } from '../app.config.provider';
import { FilmsMemoryRepository } from './films.memory.repository';
import { FilmsMongoRepository } from './films.mongo.repository';
import { FILMS_REPOSITORY, FilmsRepository } from './films.repository';

@Module({
  providers: [
    {
      provide: FILMS_REPOSITORY,
      useFactory: async (config: AppConfig): Promise<FilmsRepository> => {
        if (config.database.driver === 'mongodb') {
          if (!config.database.url) {
            throw new Error('DATABASE_URL is not set');
          }
          if (mongoose.connection.readyState === 0) {
            await mongoose.connect(config.database.url);
          }
          return new FilmsMongoRepository();
        }

        return new FilmsMemoryRepository();
      },
      inject: [CONFIG],
    },
  ],
  exports: [FILMS_REPOSITORY],
})
export class RepositoryModule {}
