import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as config from 'config';
import { ConnectionOptions } from 'typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

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
  imports: [TypeOrmModule.forRoot({ ...ormConfig, autoLoadEntities: true })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
