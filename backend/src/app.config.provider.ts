import { ConfigService } from '@nestjs/config';

export const CONFIG = 'CONFIG';

export const configProvider = {
  provide: CONFIG,
  useFactory: (configService: ConfigService): AppConfig => ({
    port: Number(configService.get<string>('PORT', '3000')),
    database: {
      driver: configService.get<string>('DATABASE_DRIVER', 'memory'),
      url: configService.get<string>('DATABASE_URL', ''),
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
}
