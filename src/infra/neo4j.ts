import neo4j from 'neo4j-driver';

import { env } from '../env';

export const neo4jDriver = neo4j.driver(env.NEO4J.DATABASE_URL, neo4j.auth.basic(env.NEO4J.USER, env.NEO4J.PASSWORD));
