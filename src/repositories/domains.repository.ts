import { inArray, node, Query, relation } from 'cypher-query-builder';
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
import { Resource, ResourceType } from '../entities/Resource';
import { neo4jDriver, neo4jQb } from '../infra/neo4j';
import {
  attachUniqueNodes,
  createRelatedNode,
  deleteOne,
  detachUniqueNodes,
  findOne,
  getRelatedNodes,
  updateOne,
} from './util/abstract_graph_repo';
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

export const getDomainResources = async (
  domainId: string,
  userId: string | undefined,
  {
    query,
    filter,
    sortingType,
  }: { query?: string; filter?: DomainResourcesFilter; sortingType: APIDomainResourcesSortingType }
): Promise<Resource[]> => {
  const q = new Query(neo4jQb);
  if (userId) q.matchNode('u', 'User', { _id: userId });

  q.match([node('d', 'Domain', { _id: domainId }), relation('in', '', 'BELONGS_TO'), node('r', 'Resource')]);

  const hasWhereClause = !!filter && !!filter.resourceTypeIn;
  if (hasWhereClause)
    q.where({
      r: {
        ...(!!filter?.resourceTypeIn && { type: inArray(filter.resourceTypeIn) }),
      },
    });
  if (query)
    q.raw(
      `${
        hasWhereClause ? ' AND ' : 'WHERE '
      } (toLower(r.name) CONTAINS toLower($query) OR toLower(r.description) CONTAINS toLower($query) OR toLower(r.url) CONTAINS toLower($query))`, // OR toLower(r.type) CONTAINS toLower($query) OR  ?
      { query }
    );
  if (userId && filter?.consumedByUser === true)
    q.raw(`${hasWhereClause || query ? ' AND ' : 'WHERE '}(u)-[:CONSUMED]->(r)`);
  if (userId && filter?.consumedByUser === false)
    q.raw(`${hasWhereClause || query ? ' AND ' : 'WHERE NOT '}(u)-[:CONSUMED]->(r)`);

  if (sortingType === APIDomainResourcesSortingType.Recommended) {
    q.optionalMatch([node('r'), relation('out', '', 'COVERS'), node('cc', 'Concept')]);
    q.optionalMatch([node('cc'), relation('out', 'dpc', 'REFERENCES', [0, 5]), node('mpc', 'Concept')]);
    // q.where(not([node('r'), relation('out', '', 'COVERS'), node('mpc')]));
    q.raw('WHERE NOT (r)-[:COVERS]->(mpc)');
    if (userId) q.raw('AND NOT (u)-[:KNOWS]->(mpc)');
    if (userId) q.optionalMatch([node('cc'), relation('in', 'rkc', 'KNOWS'), node('u')]);
    if (userId)
      q.with([
        'DISTINCT r',
        'count(cc) as ccc',
        'count(distinct mpc) as cmpc',
        '1 - toFloat(count(rkc)+0.0001)/(count(cc)+0.0001) as usefulness',
      ]);
    else q.with(['DISTINCT r', 'count(cc) as ccc', 'count(distinct mpc) as cmpc']);

    if (userId)
      q.return(['r', 'properties(r) as resource', 'cmpc', ' usefulness', 'sign(ccc)*usefulness/(0.1+cmpc) as score']);
    else q.return(['r', 'cmpc', 'sign(ccc)/(0.1+cmpc) as score']);
    q.orderBy('score', 'DESC');
  } else {
    q.match([node('r'), relation('in', 'createdResource', 'CREATED'), node('', 'User')]);
    q.return(['r']);
    q.orderBy('createdResource.createdAt', 'DESC');
  }

  const r = await q.run();
  const resources = r.map(i => i.r.properties);
  return resources;
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
