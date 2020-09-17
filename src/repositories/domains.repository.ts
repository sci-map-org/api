import { map, prop } from 'ramda';
import * as shortid from 'shortid';
import { APIDomainResourcesSortingType } from '../api/schema/types';
import { Concept, ConceptLabel } from '../entities/Concept';
import { Domain, DomainLabel } from '../entities/Domain';
import { ConceptBelongsToDomain, ConceptBelongsToDomainLabel } from '../entities/relationships/ConceptBelongsToDomain';
import {
  DEFAULT_INDEX_VALUE,
  DomainBelongsToDomain,
  DomainBelongsToDomainLabel,
} from '../entities/relationships/DomainBelongsToDomain';
import {
  ResourceBelongsToDomain,
  ResourceBelongsToDomainLabel,
} from '../entities/relationships/ResourceBelongsToDomain';
import { Resource, ResourceLabel, ResourceType } from '../entities/Resource';
import { neo4jDriver } from '../infra/neo4j';
import {
  attachUniqueNodes,
  createRelatedNode,
  deleteOne,
  detachUniqueNodes,
  findOne,
  getRelatedNodes,
  updateOne,
} from './util/abstract_graph_repo';
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

interface DomainResourcesFilter {
  resourceTypeIn?: ResourceType[];
  consumedByUser?: Boolean;
}
// TODO rename, find convention
export const listDomainResources = (
  domainFilter: { key: string } | { _id: string },
  {
    query,
    filter,
    sortingType,
  }: { query?: string; filter?: DomainResourcesFilter; sortingType: APIDomainResourcesSortingType }
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
      filter: {
        ...(filter?.resourceTypeIn && { type: { $in: filter.resourceTypeIn } }),
      },
    },
    pagination: { offset: 0, limit: 100 },
  })
    .then(prop('items'))
    .then(map(prop('destinationNode')));

export const getDomainRelevantResources = async (
  domainId: string,
  userId: string | undefined,
  { query, filter }: { query?: string; filter?: DomainResourcesFilter }
): Promise<Resource[]> => {
  const session = neo4jDriver.session();

  let cypherQuery: string;
  if (!userId) {
    cypherQuery = `match (d:Domain {_id: $domainId})<-[:BELONGS_TO]-(r:Resource) optional match (r)-[:COVERS]->(cc:Concept) 
  optional match (cc)-[dpc:REFERENCES*0..5]->(mpc:Concept) WHERE NOT (r)-[:COVERS]->(mpc)
  WITH DISTINCT r, count(distinct mpc) as cmpc, count(cc) as ccc return r, properties(r) as resource, cmpc, sign(ccc)/(0.1+cmpc) as score ORDER BY score DESC`;
  } else {
    cypherQuery = `match (u:User {_id: $userId}) match (d:Domain {_id: $domainId})<-[:BELONGS_TO]-(r:Resource) optional match (r)-[:COVERS]->(cc:Concept) 
  optional match (cc)-[dpc:REFERENCES*0..5]->(mpc:Concept) WHERE NOT (r)-[:COVERS]->(mpc) AND NOT (u)-[:KNOWS]->(mpc) 
  optional match (cc)<-[rkc:KNOWS]-(u) 
  WITH DISTINCT r, count(cc) as ccc, 1 - toFloat(count(rkc)+0.0001)/(count(cc)+0.0001) as usefulness, count(distinct mpc) as cmpc return r, properties(r) as resource, usefulness, cmpc, sign(ccc)*usefulness/(0.1+cmpc) as score ORDER BY score DESC`;
  }

  const { records } = await session.run(cypherQuery, {
    domainId,
    userId,
  });

  session.close();
  return records.map(r => {
    return r.get('resource');
  });
};

export const attachDomainBelongsToDomain = (
  parentDomainId: string,
  subDomainId: string,
  index?: number
): Promise<{ subDomain: Domain; relationship: DomainBelongsToDomain; parentDomain: Domain }> =>
  attachUniqueNodes<Concept, DomainBelongsToDomain, Domain>({
    originNode: { label: DomainLabel, filter: { _id: subDomainId } },
    relationship: {
      label: DomainBelongsToDomainLabel,
      onCreateProps: { index: index || DEFAULT_INDEX_VALUE },
      onMergeProps: { index },
    },
    destinationNode: { label: DomainLabel, filter: { _id: parentDomainId } },
  }).then(({ originNode, relationship, destinationNode }) => {
    return {
      subDomain: originNode,
      relationship,
      parentDomain: destinationNode,
    };
  });

export const detachDomainBelongsToDomain = (
  parentDomainId: string,
  subDomainId: string
): Promise<{ subDomain: Domain; parentDomain: Domain }> =>
  detachUniqueNodes<Domain, DomainBelongsToDomain, Domain>({
    originNode: {
      label: DomainLabel,
      filter: { _id: subDomainId },
    },
    relationship: {
      label: DomainBelongsToDomainLabel,
      filter: {},
    },
    destinationNode: {
      label: DomainLabel,
      filter: { _id: parentDomainId },
    },
  }).then(({ originNode, destinationNode }) => {
    return {
      subDomain: originNode,
      parentDomain: destinationNode,
    };
  });

const getDomainBelongsToDomains = (filter: { _id: string } | { key: string }, direction: 'IN' | 'OUT') =>
  getRelatedNodes<Domain, DomainBelongsToDomain, Domain>({
    originNode: {
      label: DomainLabel,
      filter,
    },
    relationship: {
      label: DomainBelongsToDomainLabel,
      direction,
    },
    destinationNode: {
      label: DomainLabel,
    },
  }).then(({ items }) => items.map(item => ({ domain: item.destinationNode, relationship: item.relationship })));

export const getDomainSubDomains = (filter: { _id: string } | { key: string }) =>
  getDomainBelongsToDomains(filter, 'IN');

export const getDomainParentDomains = (filter: { _id: string } | { key: string }) =>
  getDomainBelongsToDomains(filter, 'OUT');
