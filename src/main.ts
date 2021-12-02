import { ValidationError, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as config from 'config';

import { AppModule } from './app.module';
import { ApiError } from './shared/api-error';
import { ErrorCodes } from './shared/error-codes';
import { HttpExceptionFilter } from './shared/http-exception.filter';

const port: number = config.get('port');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('online-library')
    .setDescription('The online-library API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  config.security = [{ bearer: [] }];

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors: ValidationError[]) =>
        new ApiError(400, ErrorCodes.VALIDATION_FAILED, errors),
      validationError: { target: false, value: false },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(port);
}
bootstrap();
