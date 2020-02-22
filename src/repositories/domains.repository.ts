import * as shortid from 'shortid';

import { Concept, ConceptLabel } from '../entities/Concept';
import { Domain, DomainLabel } from '../entities/Domain';
import { ConceptBelongsToDomainLabel, ConceptBelongsToDomain } from '../entities/relationships/ConceptBelongsToDomain';
import {
  ResourceBelongsToDomainLabel,
  ResourceBelongsToDomain,
} from '../entities/relationships/ResourceBelongsToDomain';
import { Resource, ResourceLabel } from '../entities/Resource';
import { neo4jDriver } from '../infra/neo4j';
import { createRelatedNode, deleteOne, findOne, getRelatedNodes, updateOne } from './util/abstract_graph_repo';
import { prop, map } from 'ramda';
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

export const getDomainResources = (domainFilter: { key: string } | { _id: string }): Promise<Resource[]> =>
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
  })
    .then(prop('items'))
    .then(map(prop('destinationNode')));
