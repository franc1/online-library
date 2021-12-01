import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as config from 'config';
import { ConnectionOptions } from 'typeorm';

import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/passport-strategies/jwt/jwt-auth.guard';
import { StudentModule } from './student/student.module';
import { UserModule } from './user/user.module';
import { HttpExceptionFilter } from './utils/http-exception.filter';

const ormConfig = {
  name: 'default',
  type: 'postgres',
  host: config.get('dbHost'),
  port: config.get('dbPort'),
  username: config.get('dbUser'),
  password: config.get('dbPass'),
  database: config.get('dbName'),
  logger: 'advanced-console', // TODO: make custom logger
  logging: process.env.NODE_ENV !== 'production',
  migrationsRun: true,
  entities: [__dirname + '/models/*.{js,ts}'],
  migrations: [__dirname + '/migrations/*.{js,ts}'],
  subscribers: [__dirname + '/subscribers/**/*.{js,ts}'],
  cli: {
    entitiesDir: __dirname + '/models',
    migrationsDir: __dirname + '/migrations',
    subscribersDir: __dirname + '/subscribers',
  },
} as ConnectionOptions;

@Module({
  imports: [
    TypeOrmModule.forRoot({ ...ormConfig, autoLoadEntities: true }),
    AuthModule,
    UserModule,
    StudentModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
