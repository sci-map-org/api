import neo4j from 'neo4j-driver';

export const neo4jDriver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', 'skalitzer303'));

// export const neo4jSession = neo4jDriver.session();
