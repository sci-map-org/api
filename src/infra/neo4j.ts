import { Connection } from 'cypher-query-builder';
import neo4j from 'neo4j-driver';
import { env } from '../env';
import { logger } from './logger';

// Make sure to include the protocol in the hostname
export const neo4jQb = new Connection(env.NEO4J.DATABASE_URL, neo4j.auth.basic(env.NEO4J.USER, env.NEO4J.PASSWORD));

export const neo4jDriver = neo4j.driver(env.NEO4J.DATABASE_URL, neo4j.auth.basic(env.NEO4J.USER, env.NEO4J.PASSWORD));

process.on('exit', () => {
  neo4jDriver.close();
  logger.info('Closing neo4j driver');
});
