import * as shortid from 'shortid';

import { Concept, ConceptLabel } from '../entities/Concept';
import { Domain, DomainLabel } from '../entities/Domain';
import { ConceptBelongsToDomainLabel } from '../entities/relationships/ConceptBelongsToDomain';
import { ResourceBelongsToDomainLabel } from '../entities/relationships/ResourceBelongsToDomain';
import { Resource, ResourceLabel } from '../entities/Resource';
import { neo4jDriver } from '../infra/neo4j';
import { createRelatedNode, deleteOne, findOne, getRelatedNodes, updateOne } from './util/abstract_graph_repo';

interface CreateDomainData {
  key: string;
  name: string;
  description?: string;
}

interface UpdateDomainData {
  key?: string;
  name?: string;
  description?: string;
}

export const createDomain = (user: { _id: string } | { key: string }, data: CreateDomainData): Promise<Domain> =>
  createRelatedNode({
    originNode: { label: 'User', filter: user },
    relationship: { label: 'CREATED', props: { createdAt: Date.now() } },
    newNode: { label: DomainLabel, props: { ...data, _id: shortid.generate() } },
  });

export const searchDomains = async (
  { query }: { query?: string },
  pagination: { offset?: number; limit?: number }
): Promise<Domain[]> => {
  const session = neo4jDriver.session();
  const { records } = await session.run(
    `MATCH (node:${DomainLabel}) ${
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

export const findDomain = findOne<Domain, { key: string } | { _id: string }>({ label: DomainLabel });

export const updateDomain = updateOne<Domain, { _id: string } | { key: string }, UpdateDomainData>({
  label: DomainLabel,
});

export const deleteDomain = deleteOne<Domain, { _id: string } | { key: string }>({ label: DomainLabel });

export const getDomainConcepts = (domainFilter: { key: string } | { _id: string }) =>
  getRelatedNodes<Concept>({
    originNode: {
      label: DomainLabel,
      filter: domainFilter,
    },
    relationship: {
      label: ConceptBelongsToDomainLabel,
      filter: {},
    },
    destinationNode: {
      label: ConceptLabel,
      filter: {},
    },
  });

export const getDomainResources = (domainFilter: { key: string } | { _id: string }) =>
  getRelatedNodes<Resource>({
    originNode: {
      label: DomainLabel,
      filter: domainFilter,
    },
    relationship: {
      label: ResourceBelongsToDomainLabel,
      filter: {},
    },
    destinationNode: {
      label: ResourceLabel,
      filter: {},
    },
  });