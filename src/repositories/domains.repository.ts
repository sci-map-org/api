import { map, prop } from 'ramda';
import * as shortid from 'shortid';
import { Concept, ConceptLabel } from '../entities/Concept';
import { Domain, DomainLabel } from '../entities/Domain';
import { ConceptBelongsToDomain, ConceptBelongsToDomainLabel } from '../entities/relationships/ConceptBelongsToDomain';
import {
  ResourceBelongsToDomain,
  ResourceBelongsToDomainLabel,
} from '../entities/relationships/ResourceBelongsToDomain';
import { Resource, ResourceLabel } from '../entities/Resource';
import { neo4jDriver } from '../infra/neo4j';
import { createRelatedNode, deleteOne, findOne, getRelatedNodes, updateOne } from './util/abstract_graph_repo';
import { PaginationOptions } from './util/pagination';
import { SortingDirection } from './util/sorting';

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

export const getDomainConcepts = (
  domainFilter: { key: string } | { _id: string },
  sorting?: { direction: SortingDirection; entity: 'relationship' | 'concept'; field: 'index' | '_id' }
): Promise<{ concept: Concept; relationship: ConceptBelongsToDomain }[]> =>
  getRelatedNodes<Domain, ConceptBelongsToDomain, Concept>({
    originNode: {
      label: DomainLabel,
      filter: domainFilter,
    },
    relationship: {
      label: ConceptBelongsToDomainLabel,
    },
    destinationNode: {
      label: ConceptLabel,
    },
    ...(sorting && {
      sorting: {
        entity: sorting.entity === 'concept' ? 'destinationNode' : sorting.entity,
        direction: sorting.direction,
        field: sorting.field,
      },
    }),
  })
    .then(prop('items'))
    .then(
      map(item => ({
        relationship: item.relationship,
        concept: item.destinationNode,
      }))
    );

// TODO rename, find convention
export const listDomainResources = (
  domainFilter: { key: string } | { _id: string },
  pagination?: PaginationOptions
): Promise<Resource[]> =>
  getRelatedNodes<Domain, ResourceBelongsToDomain, Resource>({
    originNode: {
      label: DomainLabel,
      filter: domainFilter,
    },
    relationship: {
      label: ResourceBelongsToDomainLabel,
    },
    destinationNode: {
      label: ResourceLabel,
    },
    pagination: { offset: 0, limit: 100, ...pagination },
  })
    .then(prop('items'))
    .then(map(prop('destinationNode')));

export const getDomainRelevantResources = async (
  domainId: string,
  userId: string | undefined,
  pagination?: PaginationOptions
): Promise<Resource[]> => {
  const session = neo4jDriver.session();

  const query = `match (u:User {_id: $userId}) match (d:Domain {_id: $domainId})<-[:BELONGS_TO]-(r:Resource)-[:COVERS]->(cc:Concept) 
  optional match (cc)-[dpc:REFERENCES*0..5]->(mpc:Concept) WHERE NOT (r)-[:COVERS]->(mpc) AND NOT (u)-[:KNOWS]->(mpc) 
  optional match (cc)<-[rkc:KNOWS]-(u) 
  WITH DISTINCT r, 1 - toFloat(count(rkc))/count(cc) as usefulness, count(distinct mpc) as cmpc return r, properties(r) as resource, usefulness, cmpc, usefulness/(0.1+cmpc) as score ORDER BY score DESC`;

  const { records } = await session.run(query, {
    domainId,
    userId,
  });

  session.close();
  return records.map(r => {
    return r.get('resource');
  });
};
