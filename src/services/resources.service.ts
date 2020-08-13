import { omit } from 'lodash';
import {
  ResourceMediaType,
  ResourceType,
  APIDomainResourcesOptions,
  SortingDirection,
  APIDomainResourcesSortingType,
} from '../api/schema/types';
import { Resource } from '../entities/Resource';
import { createResource } from '../repositories/resources.repository';
import { attachResourceTagsToResource, findOrCreateResourceTag } from '../repositories/resource_tags.repository';
import { listDomainResources, getDomainRelevantResources } from '../repositories/domains.repository';
import { PaginationOptions } from '../repositories/util/pagination';

interface CreateAndSaveResourceData {
  name: string;
  type: ResourceType;
  mediaType: ResourceMediaType;
  url: string;
  description?: string;
  tags?: string[];
}

export const createAndSaveResource = async (data: CreateAndSaveResourceData, userId: string): Promise<Resource> => {
  const tags = data.tags;
  const createdResource = await createResource({ _id: userId }, omit(data, 'tags'));
  if (tags && tags.length) {
    const resourceTags = await Promise.all(tags.map(t => findOrCreateResourceTag(t)));
    await attachResourceTagsToResource(
      createdResource._id,
      resourceTags.map(r => r.name)
    );
  }
  return createdResource;
};

interface GetDomainResourcesOptions {
  sorting?: { direction: SortingDirection; type: APIDomainResourcesSortingType };
  pagination?: PaginationOptions;
}
/**
 * Default: sort by Relevance
 */
export const getDomainResources = async (
  domainId: string,
  userId: string | undefined,
  options: GetDomainResourcesOptions
): Promise<Resource[]> => {
  const sorting = options.sorting || {
    direction: SortingDirection.DESC,
    type: APIDomainResourcesSortingType.Relevance,
  };
  if (sorting.type === APIDomainResourcesSortingType.Relevance) {
    return getDomainRelevantResources(domainId, userId, options.pagination);
  }
  return listDomainResources({ _id: domainId });
};
