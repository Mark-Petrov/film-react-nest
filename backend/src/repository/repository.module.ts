import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfig, CONFIG } from '../app.config.provider';
import { AppConfigModule } from '../app-config.module';
import { Film } from './entities/film';
import { Schedule } from './entities/schedule';
import { FilmsPostgresRepository } from './films.postgres.repository';
import { FILMS_REPOSITORY } from './films.repository';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [CONFIG],
      useFactory: (config: AppConfig) => ({
        type: 'postgres',
        url: config.database.url,
        username: config.database.username,
        password: config.database.password,
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    TypeOrmModule.forFeature([Film, Schedule]),
  ],
  providers: [
    {
      provide: FILMS_REPOSITORY,
      useClass: FilmsPostgresRepository,
    },
  ],
  exports: [FILMS_REPOSITORY],
})
export class RepositoryModule {}
