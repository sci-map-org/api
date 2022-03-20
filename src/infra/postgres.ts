import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { Comment } from '../entities/Comment';
import { env } from '../env';

const connectionPromise = createConnection({
  type: 'postgres',
  host: env.POSTGRES.HOST,
  port: Number.parseInt(env.POSTGRES.PORT, 10),
  username: env.POSTGRES.USERNAME,
  password: env.POSTGRES.PASSWORD,
  database: env.POSTGRES.DATABASE,
  synchronize: false,
  logging: false,
  entities: [Comment],
}).catch((err) => {
  console.error('Unable to connect to Postgres');
  throw err;
});

export const getPostgresConnection = async () => {
  const connection = await connectionPromise;
  return connection;
};
