import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfig, CONFIG } from '../app.config.provider';
import { AppConfigModule } from '../app-config.module';
import { Film } from './entities/film';
import { Schedule } from './entities/schedule';
import { AppRepository } from './app.repository';
import { FILMS_REPOSITORY } from './films.repository';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [CONFIG],
      useFactory: (config: AppConfig) => {
        if (config.database.driver !== 'postgres') {
          throw new Error(
            `Unsupported DATABASE_DRIVER: ${config.database.driver}`,
          );
        }
        const url = new URL(config.database.url);
        return {
          type: config.database.driver,
          host: url.hostname,
          port: Number(url.port || 5432),
          database: url.pathname.replace(/^\//, ''),
          username:
            config.database.username || decodeURIComponent(url.username),
          password:
            config.database.password || decodeURIComponent(url.password),
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
      useClass: AppRepository,
    },
  ],
  exports: [FILMS_REPOSITORY],
})
export class RepositoryModule {}
