import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ValidationError } from 'class-validator';
import { AppConfig, CONFIG } from './app.config.provider';
import { AppModule } from './app.module';

function validationMessage(errors: ValidationError[]): string {
  return errors
    .flatMap((error) => [
      ...Object.values(error.constraints ?? {}),
      ...(error.children?.length ? [validationMessage(error.children)] : []),
    ])
    .filter(Boolean)
    .join('; ');
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<AppConfig>(CONFIG);
  app.setGlobalPrefix('api/afisha');
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]) =>
        new HttpException(
          { error: validationMessage(errors) || 'Некорректные данные' },
          HttpStatus.BAD_REQUEST,
        ),
    }),
  );
  await app.listen(config.port);
}
bootstrap();
