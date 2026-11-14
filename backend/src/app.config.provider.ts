import { ConfigService } from '@nestjs/config';

export const CONFIG = 'CONFIG';

export const configProvider = {
  provide: CONFIG,
  useFactory: (configService: ConfigService): AppConfig => ({
    port: Number(configService.get<string>('PORT', '3000')),
    database: {
      driver: configService.get<string>('DATABASE_DRIVER', 'postgres'),
      url: configService.get<string>('DATABASE_URL', ''),
      username: configService.get<string>('DATABASE_USERNAME', 'postgres'),
      password: configService.get<string>('DATABASE_PASSWORD', 'postgres'),
    },
  }),
  inject: [ConfigService],
};

export interface AppConfig {
  port: number;
  database: AppConfigDatabase;
}

export interface AppConfigDatabase {
  driver: string;
  url: string;
  username: string;
  password: string;
}
