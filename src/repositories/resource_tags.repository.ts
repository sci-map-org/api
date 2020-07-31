import { map, prop } from 'ramda';

import {
  ResourceTagBelongsToResource,
  ResourceTagBelongsToResourceLabel,
} from '../entities/relationships/ResourceTagBelongsToResource';
import { Resource, ResourceLabel } from '../entities/Resource';
import { ResourceTag, ResourceTagLabel } from '../entities/ResourceTag';
import { neo4jDriver } from '../infra/neo4j';
import { attachNodes, createNode, detachNodes, findOne, getRelatedNodes } from './util/abstract_graph_repo';

export const getResourceResourceTags = (resourceId: string): Promise<ResourceTag[]> =>
  getRelatedNodes<Resource, ResourceTagBelongsToResource, ResourceTag>({
    originNode: {
      label: ResourceLabel,
      filter: {
        _id: resourceId,
      },
    },
    relationship: {
      label: ResourceTagBelongsToResourceLabel,
    },
    destinationNode: {
      label: ResourceTagLabel,
    },
  })
    .then(prop('items'))
    .then(map(prop('destinationNode')));

export const findOrCreateResourceTag = async (name: string): Promise<ResourceTag> => {
  const existingResourceTag = await findOne<ResourceTag, { name: string }>({ label: ResourceTagLabel })({
    name: name.toLowerCase(),
  });
  if (existingResourceTag) {
    return existingResourceTag;
  }
  return createNode<ResourceTag>({ label: ResourceTagLabel })({ name: name.toLowerCase() });
};

export const attachResourceTagsToResource = (resourceId: string, tags: string[]) =>
  Promise.all(
    tags.map(tag =>
      attachNodes<Resource, ResourceTagBelongsToResource, ResourceTag>({
        originNode: {
          label: ResourceLabel,
          filter: { _id: resourceId },
        },
        relationship: {
          label: ResourceTagBelongsToResourceLabel,
        },
        destinationNode: {
          label: ResourceTagLabel,
          filter: { name: tag.toLowerCase() },
        },
      })
    )
  );

export const detachResourceTagsFromResource = (resourceId: string, tags: string[]): Promise<Resource> =>
  detachNodes<Resource, ResourceTagBelongsToResource, ResourceTag>({
    originNode: {
      label: ResourceLabel,
      filter: { _id: resourceId },
    },
    relationship: {
      label: ResourceTagBelongsToResourceLabel,
      filter: {},
    },
    destinationNode: {
      label: ResourceTagLabel,
      filter: { name: { $in: tags.map(tag => tag.toLowerCase()) } },
    },
  }).then(([{ originNode }]) => originNode);

export const findResourceTags = async (query: string, pagination: { offset?: number; limit?: number }) => {
  const session = neo4jDriver.session();
  const { records } = await session.run(
    `MATCH (node:${ResourceTagLabel})<-[relation:${ResourceTagBelongsToResourceLabel}]-(resource:${ResourceLabel}) ${
      query ? 'WHERE toLower(node.name) CONTAINS toLower($query) ' : ''
    }RETURN properties(node) AS node, COUNT(relation) as usageCount ORDER BY COUNT(relation) DESC${
      pagination && pagination.offset ? ' SKIP ' + pagination.offset : ''
    }${pagination && pagination.limit ? ' LIMIT ' + pagination.limit : ''}`,
    {
      query,
    }
  );
  session.close();
  return records.map(r => ({ name: r.get('node').name, usageCount: r.get('usageCount').toNumber() }));
};
