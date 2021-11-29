import * as config from 'config';
import { ConnectionOptions } from 'typeorm';

export = {
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
  entities: [__dirname + '/src/models/*.{js,ts}'],
  migrations: [__dirname + '/src/migrations/*.{js,ts}'],
  subscribers: [__dirname + '/src/subscribers/**/*.{js,ts}'],
  cli: {
    entitiesDir: __dirname + '/src/models',
    migrationsDir: __dirname + '/src/migrations',
    subscribersDir: __dirname + '/src/subscribers',
  },
} as ConnectionOptions;
