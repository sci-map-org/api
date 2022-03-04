require('dotenv').config();

module.exports = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number.parseInt(process.env.POSTGRES_PORT, 10),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  synchronize: false,
  logging: false,
  migrations: ['src/infra/migrations/**/*.ts'],
  migrationsTableName: 'custom_migration_table',
  cli: {
    migrationsDir: 'src/infra/migrations',
  },
};
