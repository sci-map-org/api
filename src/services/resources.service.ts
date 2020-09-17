import { omit } from 'lodash';
import {
  APIDomainResourcesOptions,
  APIDomainResourcesSortingType,
  ResourceMediaType,
  ResourceType,
} from '../api/schema/types';
import { NullToUndefined } from '../api/util/nullToUndefined';
import { Resource } from '../entities/Resource';
import { getDomainRelevantResources, listDomainResources } from '../repositories/domains.repository';
import { createResource } from '../repositories/resources.repository';
import { attachResourceTagsToResource, findOrCreateResourceTag } from '../repositories/resource_tags.repository';

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

// interface GetDomainResourcesOptions {
//   sorting?: { direction: SortingDirection; type: APIDomainResourcesSortingType };
//   pagination?: PaginationOptions;
// }
/**
 * Default: sort by Relevance
 */
export const getDomainResources = async (
  domainId: string,
  userId: string | undefined,
  { sortingType, filter, query }: NullToUndefined<APIDomainResourcesOptions>
): Promise<Resource[]> => {
  // const sorting = options.sorting || {
  //   direction: SortingDirection.DESC,
  //   type: APIDomainResourcesSortingType.Relevance,
  // };
  if (sortingType === APIDomainResourcesSortingType.Relevance) {
    return getDomainRelevantResources(domainId, userId, { query, filter });
  }
  return listDomainResources({ _id: domainId }, { query, filter, sortingType });
};
