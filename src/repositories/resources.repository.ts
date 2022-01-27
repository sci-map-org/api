import { node, Query, relation } from 'cypher-query-builder';
import { map, prop } from 'ramda';
import * as shortid from 'shortid';
import { APIUserConsumedResourcesSortingType } from '../api/schema/types';
import { LearningMaterialLabel } from '../entities/LearningMaterial';
import {
  ResourceBelongsToResource,
  ResourceBelongsToResourceLabel,
} from '../entities/relationships/ResourceBelongsToResource';
import {
  ResourceHasNextResource,
  ResourceHasNextResourceLabel,
} from '../entities/relationships/ResourceHasNextResource';
import {
  ResourceStartsWithResource,
  ResourceStartsWithResourceLabel,
} from '../entities/relationships/ResourceStartsWithResource';
import { UserConsumedResource, UserConsumedResourceLabel } from '../entities/relationships/UserConsumedResource';
import {
  UserCreatedLearningMaterial,
  UserCreatedLearningMaterialLabel,
} from '../entities/relationships/UserCreatedLearningMaterial';
import { Resource, ResourceLabel, ResourceMediaType, ResourceType } from '../entities/Resource';
import { User, UserLabel } from '../entities/User';
import { neo4jDriver, neo4jQb } from '../infra/neo4j';
import {
  attachUniqueNodes,
  countRelatedNodes,
  createRelatedNode,
  deleteOne,
  deleteRelatedNode,
  findOne,
  getOptionalRelatedNode,
  getRelatedNode,
  getRelatedNodes,
  updateOne,
} from './util/abstract_graph_repo';
import { PaginationOptions } from './util/pagination';

export const searchResources = async (
  query: string,
  options: { pagination?: PaginationOptions }
): Promise<Resource[]> => {
  const pagination: Required<PaginationOptions> = {
    limit: 20,
    offset: 0,
    ...options.pagination,
  };
  const q = new Query(neo4jQb);
  q.match([node('r', ResourceLabel)]);
  q.raw(
    `WHERE (toLower(r.name) CONTAINS toLower($query) OR toLower(r.description) CONTAINS toLower($query) OR toLower(r.url) CONTAINS toLower($query) OR toLower(r.type) CONTAINS toLower($query))`,
    { query }
  );
  q.return('r').skip(pagination.offset).limit(pagination.limit);

  const results = await q.run();
  return results.map((item) => item.r.properties);
};
interface CreateResourceData {
  name: string;
  type: ResourceType;
  mediaType: ResourceMediaType;
  url: string;
  description?: string;
}

interface UpdateResourceData {
  name?: string;
  type?: ResourceType;
  mediaType?: ResourceMediaType;
  url?: string;
  description?: string;
  durationSeconds?: number | null;
}

export const createResource = (user: { _id: string }, data: CreateResourceData): Promise<Resource> =>
  createRelatedNode<User, UserCreatedLearningMaterial, Resource>({
    originNode: { label: UserLabel, filter: user },
    relationship: { label: UserCreatedLearningMaterialLabel, props: { createdAt: Date.now() } },
    newNode: {
      labels: [ResourceLabel, LearningMaterialLabel],
      props: { ...data, createdAt: Date.now(), _id: shortid.generate() },
    },
  });

export const updateResource = updateOne<Resource, { _id: string }, UpdateResourceData>({ label: ResourceLabel });

export const deleteResource = deleteOne<Resource, { _id: string }>({ label: ResourceLabel });

export const deleteResourceCreatedBy = (
  creatorFilter: { _id: string } | { key: string },
  resourceId: string
): Promise<{ deletedCount: number }> =>
  deleteRelatedNode<User, UserCreatedLearningMaterial, Resource>({
    originNode: {
      label: UserLabel,
      filter: creatorFilter,
    },
    relationship: {
      label: UserCreatedLearningMaterialLabel,
      filter: {},
    },
    destinationNode: {
      label: ResourceLabel,
      filter: { _id: resourceId },
    },
  });

export const findResource = findOne<Resource, { _id: string }>({ label: ResourceLabel });

export const getUserConsumedResource = async (
  userId: string,
  resourceId: string
): Promise<UserConsumedResource | null> => {
  const item = await getOptionalRelatedNode<User, UserConsumedResource, Resource>({
    originNode: {
      label: UserLabel,
      filter: { _id: userId },
    },
    relationship: {
      label: UserConsumedResourceLabel,
    },
    destinationNode: {
      label: ResourceLabel,
      filter: { _id: resourceId },
    },
  });
  return item ? item.relationship : null;
};

export const getResourceSubResources = (parentResourceId: string) =>
  getRelatedNodes<Resource, ResourceBelongsToResource, Resource>({
    originNode: {
      label: ResourceLabel,
      filter: { _id: parentResourceId },
    },
    relationship: {
      label: ResourceBelongsToResourceLabel,
      direction: 'IN',
    },
    destinationNode: {
      label: ResourceLabel,
    },
  }).then(map(prop('destinationNode')));

export const getResourceSubResourceSeries = async (parentResourceId: string) => {
  const q = new Query(neo4jQb);
  q.match([
    node('parent', ResourceLabel, { _id: parentResourceId }),
    relation('out', '', ResourceStartsWithResourceLabel),
    node('i', ResourceLabel),
  ]);
  q.optionalMatch([
    node('i'),
    relation('out', '', ResourceHasNextResourceLabel, undefined, [1, 100]),
    node('r', ResourceLabel),
  ]);
  q.raw(`WITH DISTINCT i, collect(r) as c UNWIND ([i] + c) as resourceSeries RETURN resourceSeries`);
  const results = await q.run();
  return results.map((r) => r.resourceSeries.properties);
};

export const getResourceParentResources = (subResourceId: string): Promise<Resource[]> =>
  getRelatedNodes<Resource, ResourceBelongsToResource, Resource>({
    originNode: {
      label: ResourceLabel,
      filter: { _id: subResourceId },
    },
    relationship: {
      label: ResourceBelongsToResourceLabel,
      filter: {},
      direction: 'OUT',
    },
    destinationNode: {
      label: ResourceLabel,
      filter: {},
    },
  }).then(map(prop('destinationNode')));

export const getResourceSeriesParentResource = async (subResourceId: string): Promise<Resource | null> => {
  const q = new Query(neo4jQb);
  q.match([
    node('s', ResourceLabel, { _id: subResourceId }),
    relation('in', '', ResourceHasNextResourceLabel, undefined, [0, 100]),
    node('r', ResourceLabel),
    relation('in', '', ResourceStartsWithResourceLabel),
    node('i', ResourceLabel),
  ]);

  q.return('i');

  const results = await q.run();
  return results.map((r) => r.i.properties)[0] || null;
};

export const getResourceNextResource = (resourceId: string): Promise<Resource | null> =>
  getOptionalRelatedNode<Resource, ResourceHasNextResource, Resource>({
    originNode: {
      label: ResourceLabel,
      filter: { _id: resourceId },
    },
    relationship: {
      label: ResourceHasNextResourceLabel,
      filter: {},
      direction: 'OUT',
    },
    destinationNode: {
      label: ResourceLabel,
      filter: {},
    },
  }).then((result) => (result ? result.destinationNode : null));

export const getResourcePreviousResource = (resourceId: string): Promise<Resource | null> =>
  getOptionalRelatedNode<Resource, ResourceHasNextResource, Resource>({
    originNode: {
      label: ResourceLabel,
      filter: { _id: resourceId },
    },
    relationship: {
      label: ResourceHasNextResourceLabel,
      filter: {},
      direction: 'IN',
    },
    destinationNode: {
      label: ResourceLabel,
      filter: {},
    },
  }).then((result) => (result ? result.destinationNode : null));

export const attachSubResourceToResource = (parentResourceId: string, subResourceId: string) =>
  attachUniqueNodes<Resource, ResourceBelongsToResource, Resource>({
    originNode: { label: ResourceLabel, filter: { _id: subResourceId } },
    relationship: { label: ResourceBelongsToResourceLabel },
    destinationNode: { label: ResourceLabel, filter: { _id: parentResourceId } },
  }).then(({ originNode, destinationNode }) => ({ parentResource: destinationNode, subResource: originNode }));

export const createSubResourceSeries = (parentResouceId: string, subResourceId: string) =>
  attachUniqueNodes<Resource, ResourceStartsWithResource, Resource>({
    originNode: { label: ResourceLabel, filter: { _id: parentResouceId } },
    relationship: { label: ResourceStartsWithResourceLabel },
    destinationNode: { label: ResourceLabel, filter: { _id: subResourceId } },
  }).then(({ originNode, destinationNode }) => ({ seriesParentResource: originNode, subResource: destinationNode }));

export const addSubResourceToSeries = (parentResourceId: string, previousResourceId: string, subResourceId: string) =>
  attachUniqueNodes<Resource, ResourceHasNextResource, Resource>({
    originNode: { label: ResourceLabel, filter: { _id: previousResourceId } },
    relationship: { label: ResourceHasNextResourceLabel, onCreateProps: { parentResourceId } },
    destinationNode: { label: ResourceLabel, filter: { _id: subResourceId } },
  }).then(({ originNode, destinationNode }) => ({
    previousResource: originNode,
    subResource: destinationNode,
  }));

export const getUserConsumedResources = async (
  userId: string,
  sorting: APIUserConsumedResourcesSortingType,
  paginationOptions: Required<PaginationOptions>,
  filter?: { completed?: boolean }
): Promise<{ relationship: UserConsumedResource; resource: Resource }[]> =>
  getRelatedNodes<User, UserConsumedResource, Resource>({
    originNode: {
      label: UserLabel,
      filter: { _id: userId },
    },
    relationship: {
      label: UserConsumedResourceLabel,
      filter: {
        openedAt: { $isNull: false },
        lastOpenedAt: { $isNull: false },
        ...(filter?.completed && { consumedAt: { $isNull: false } }),
        ...(filter?.completed === false && { consumedAt: { $isNull: true } }),
      },
    },
    destinationNode: {
      label: ResourceLabel,
      filter: {},
    },
    ...(sorting === APIUserConsumedResourcesSortingType.LastOpened && {
      sorting: {
        entity: 'relationship',
        field: 'lastOpenedAt',
        direction: 'DESC',
      },
    }),
    pagination: paginationOptions,
  }).then((results) =>
    results.map(({ destinationNode, relationship }) => ({ relationship, resource: destinationNode }))
  );

export const countUserConsumedResources = async (
  userId: string,
  sorting: APIUserConsumedResourcesSortingType,
  filter?: { completed?: boolean }
): Promise<number> =>
  countRelatedNodes<User, UserConsumedResource, Resource>({
    originNode: {
      label: UserLabel,
      filter: { _id: userId },
    },
    relationship: {
      label: UserConsumedResourceLabel,
      filter: {
        openedAt: { $isNull: false },
        lastOpenedAt: { $isNull: false },
        ...(filter?.completed && { consumedAt: { $isNull: false } }),
        ...(filter?.completed === false && { consumedAt: { $isNull: true } }),
      },
    },
    destinationNode: {
      label: ResourceLabel,
      filter: {},
    },
  });
