# online-library

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Migrations

```bash
# generate new migration
npm run typeorm migration:generate -- -n TestMigration

# generate empty migration
npm run typeorm migration:create -- -n TestMigration
```
