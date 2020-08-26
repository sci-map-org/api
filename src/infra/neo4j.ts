import neo4j from 'neo4j-driver';
import { env } from '../env';
import { logger } from './logger';

export const neo4jDriver = neo4j.driver(env.NEO4J.DATABASE_URL, neo4j.auth.basic(env.NEO4J.USER, env.NEO4J.PASSWORD));

process.on('exit', () => {
  neo4jDriver.close();
  logger.info('Closing driver');
});
