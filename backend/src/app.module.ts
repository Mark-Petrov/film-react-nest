import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'node:path';
import { AppConfigModule } from './app-config.module';
import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';

const mongoImports =
  process.env.DATABASE_DRIVER === 'mongodb'
    ? [
        MongooseModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            uri: config.get<string>('DATABASE_URL'),
          }),
        }),
      ]
    : [];

@Module({
  imports: [
    AppConfigModule,
    ...mongoImports,
    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), 'public'),
    }),
    FilmsModule,
    OrderModule,
  ],
})
export class AppModule {}
