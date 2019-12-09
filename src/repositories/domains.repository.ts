import * as shortid from 'shortid';

import { Domain } from '../entities/Domain';
import { createRelatedNode, findOne, updateOne, deleteOne, getFilterString } from './util/abstract_graph_repo';
import { neo4jDriver } from '../infra/neo4j';

const label = 'Domain';

interface CreateDomainData {
  key: string;
  name: string;
  domain?: string;
}

interface UpdateDomainData {
  key?: string;
  name?: string;
  domain?: string;
}

export const createDomain = (user: { _id: string } | { key: string }, data: CreateDomainData): Promise<Domain> =>
  createRelatedNode({
    originNode: { label: 'User', filter: user },
    relationship: { label: 'CREATED', props: { createdAt: Date.now() } },
    newNode: { label, props: { ...data, _id: shortid.generate() } },
  });

export const searchDomains = async (
  { query }: { query?: string },
  pagination: { offset?: number; limit?: number }
): Promise<Domain[]> => {
  const session = neo4jDriver.session();
  const { records } = await session.run(
    `MATCH (node:${label}) ${
      query ? 'WHERE toLower(node.name) CONTAINS toLower($query) ' : ''
    }RETURN properties(node) AS node${pagination && pagination.offset ? ' SKIP ' + pagination.offset : ''}${
      pagination && pagination.limit ? ' LIMIT ' + pagination.limit : ''
    }`,
    {
      query,
    }
  );
  session.close();
  return records.map(r => r.get('node'));
};

export const findDomain = findOne<Domain, { key: string } | { _id: string }>({ label });

export const updateDomain = updateOne<Domain, { _id: string } | { key: string }, UpdateDomainData>({ label });

export const deleteDomain = deleteOne<Domain, { _id: string } | { key: string }>({ label });
