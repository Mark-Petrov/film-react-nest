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
      useFactory: (config: AppConfig) => {
        const url = new URL(config.database.url);
        return {
          type: 'postgres' as const,
          host: url.hostname,
          port: Number(url.port || 5432),
          database: url.pathname.replace(/^\//, ''),
          username: config.database.username || decodeURIComponent(url.username),
          password: config.database.password || decodeURIComponent(url.password),
          autoLoadEntities: true,
          synchronize: false,
        };
      },
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
