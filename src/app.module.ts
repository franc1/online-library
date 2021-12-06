import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as config from 'config';
import { ConnectionOptions } from 'typeorm';

import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/passport-strategies/jwt/jwt-auth.guard';
import { BookRequestModule } from './book-request/book-request.module';
import { BookCategoryModule } from './book/book-category/book-category.module';
import { BookPublisherModule } from './book/book-publisher/book-publisher.module';
import { BookModule } from './book/book.module';
import { MailModule } from './mail/mail.module';
import { PrintingOfficeModule } from './printing-office/printing-office.module';
import { RoleModule } from './role/role.module';
import { HttpExceptionFilter } from './shared/http-exception.filter';
import { StudentModule } from './student/student.module';
import { UserModule } from './user/user.module';

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
  entities: [__dirname + '/**/*.model.{js,ts}'],
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
    BookModule,
    BookCategoryModule,
    BookPublisherModule,
    PrintingOfficeModule,
    RoleModule,
    BookRequestModule,
    MailModule,
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
