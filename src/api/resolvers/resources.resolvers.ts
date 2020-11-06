import { UserInputError } from 'apollo-server-koa';
import { Resource } from '../../entities/Resource';
import { NotFoundError } from '../../errors/NotFoundError';
import { getLearningMaterialRating } from '../../repositories/learning_materials.repository';
import {
  addSubResourceToSeries,
  attachResourceCoversConcepts,
  attachResourceToDomain,
  attachSubResourceToResource,
  createSubResourceSeries,
  deleteResource,
  deleteResourceCreatedBy,
  detachResourceCoversConcepts,














  detachResourceFromDomain, findResource,
  getResourceCoveredConcepts,

  getResourceCoveredConceptsByDomain, getResourceCreator,

  getResourceDomains,
  getResourceNextResource,
  getResourceParentResources,
  getResourcePreviousResource,








  getResourceSeriesParentResource, getResourceSubResources,
  getResourceSubResourceSeries,
  getResourceUpvoteCount,
  getUserConsumedResource,



  searchResources, updateResource,
  voteResource
} from '../../repositories/resources.repository';
import { getResourceResourceTags } from '../../repositories/resource_tags.repository';
import { attachUserConsumedResources } from '../../repositories/users.repository';
import { createAndSaveResource } from '../../services/resources.service';
import { hasAccess } from '../../services/users.service';
import { UnauthenticatedError } from '../errors/UnauthenticatedError';
import {
  APIMutationResolvers,
  APIQueryResolvers,
  APIResource,
  APIResourceResolvers,
  APIResourceVoteValue
} from '../schema/types';
import { nullToUndefined } from '../util/nullToUndefined';
import { toAPIUser } from './users.resolvers';

const SEARCH_RESOURCES_MIN_QUERY_LENGTH = 3;

export function toAPIResource(resource: Resource): APIResource {
  return resource;
}

export const searchResourcesResolver: APIQueryResolvers['searchResources'] = async (_parent, { query, options }) => {
  if (query.length < SEARCH_RESOURCES_MIN_QUERY_LENGTH)
    throw new UserInputError(`Must have at least ${SEARCH_RESOURCES_MIN_QUERY_LENGTH} characters in the search query`);
  return {
    items: await searchResources(query, nullToUndefined(options)),
  };
};

export const createResourceResolver: APIMutationResolvers['createResource'] = async (
  _parent,
  { payload },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in to add a resource');
  return toAPIResource(await createAndSaveResource(nullToUndefined(payload), user._id));
};

export const updateResourceResolver: APIMutationResolvers['updateResource'] = async (
  _parent,
  { _id, payload },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in to update a resource');
  const updatedResource = await updateResource(
    { _id },
    { ...nullToUndefined(payload), durationMs: payload.durationMs }
  );
  if (!updatedResource) throw new NotFoundError('Resource', _id, 'id');
  return toAPIResource(updatedResource);
};

export const deleteResourceResolver: APIMutationResolvers['deleteResource'] = async (_parent, { _id }, { user }) => {
  if (!user) throw new UnauthenticatedError('Must be logged in to delete a resource');

  const { deletedCount } = hasAccess('contributorOrAdmin', user)
    ? await deleteResource({ _id })
    : await deleteResourceCreatedBy({ _id: user._id }, _id);
  if (!deletedCount) throw new NotFoundError('Resource', _id, '_id');
  return {
    success: true,
    _id,
  };
};

export const addResourceToDomainResolver: APIMutationResolvers['addResourceToDomain'] = async (
  _parent,
  { domainId, payload },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in to add a resource');
  const createdResource = await createAndSaveResource(nullToUndefined(payload), user._id);
  await attachResourceToDomain(createdResource._id, domainId);
  return toAPIResource(createdResource);
};

export const attachResourceToDomainResolver: APIMutationResolvers['attachResourceToDomain'] = async (
  _parent,
  { domainId, resourceId },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in to add a resource');
  const { resource } = await attachResourceToDomain(resourceId, domainId);
  return toAPIResource(resource);
};

export const detachResourceFromDomainResolver: APIMutationResolvers['detachResourceFromDomain'] = async (
  _parent,
  { domainId, resourceId },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in to detach a resource from a domain');
  const { resource } = await detachResourceFromDomain(resourceId, domainId);
  return toAPIResource(resource);
};

export const getResourceByIdResolver: APIQueryResolvers['getResourceById'] = async (_parent, { id }) => {
  const resource = await findResource({ _id: id });
  if (!resource) throw new NotFoundError('Resource', id, '_id');
  return toAPIResource(resource);
};

export const attachResourceCoversConceptsResolver: APIMutationResolvers['attachResourceCoversConcepts'] = async (
  _parent,
  { resourceId, conceptIds },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in to add covered concepts to a resource');
  const resource = await attachResourceCoversConcepts(resourceId, conceptIds, { userId: user._id });
  if (!resource) throw new NotFoundError('Resource', resourceId, '_id');
  return toAPIResource(resource);
};

export const detachResourceCoversConceptsResolver: APIMutationResolvers['detachResourceCoversConcepts'] = async (
  _parent,
  { resourceId, conceptIds },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in to remove covered concepts to a resource');
  const resource = await detachResourceCoversConcepts(resourceId, conceptIds);
  if (!resource) throw new NotFoundError('Resource', resourceId, '_id');
  return toAPIResource(resource);
};

export const getResourceCoveredConceptsResolver: APIResourceResolvers['coveredConcepts'] = async resource => {
  return {
    items: await getResourceCoveredConcepts(resource._id),
  };
};

export const getResourceCoveredConceptsByDomainResolver: APIResourceResolvers['coveredConceptsByDomain'] = async resource => {
  return await getResourceCoveredConceptsByDomain(resource._id);
};

export const getResourceDomainsResolver: APIResourceResolvers['domains'] = async (resource) => {
  return await getResourceDomains(resource._id)
};

export const getResourceTagsResolver: APIResourceResolvers['tags'] = async resource => {
  return await getResourceResourceTags(resource._id);
};

export const setResourcesConsumedResolver: APIMutationResolvers['setResourcesConsumed'] = async (
  _parent,
  { payload },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in to consume a resource');
  const resources = await Promise.all(
    payload.resources.map(async ({ resourceId }) => {
      const foundResource = await findResource({ _id: resourceId });
      if (!foundResource) throw new NotFoundError('Resource', resourceId);
      return foundResource;
    })
  );
  await attachUserConsumedResources(
    user._id,
    payload.resources.map(r => {
      return {
        resourceId: r.resourceId,
        ...(r.opened !== undefined && { openedAt: r.opened ? Date.now() : null }),
        ...(r.consumed !== undefined && { consumedAt: r.consumed ? Date.now() : null }),
      };
    })
  );
  return resources;
};

export const getResourceConsumedResolver: APIResourceResolvers['consumed'] = async (resource, _args, { user }) => {
  if (!user) return null;
  const consumed = await getUserConsumedResource(user._id, resource._id);
  if (!consumed) return null;
  return {
    openedAt: consumed.openedAt ? new Date(consumed.openedAt) : null,
    consumedAt: consumed.consumedAt ? new Date(consumed.consumedAt) : null,
  };
};

export const voteResourceResolver: APIMutationResolvers['voteResource'] = async (
  _parent,
  { resourceId, value },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in to vote on a resource');
  const resource = await voteResource(user._id, resourceId, value === APIResourceVoteValue.Up ? 1 : -1);
  return toAPIResource(resource);
};

export const getResourceUpvotesResolver: APIResourceResolvers['upvotes'] = async resource => {
  return getResourceUpvoteCount(resource._id);
};

export const getResourceRatingResolver: APIResourceResolvers['rating'] = async resource => getLearningMaterialRating(resource._id)

export const getResourceCreatorResolver: APIResourceResolvers['creator'] = async resource => {
  const creator = await getResourceCreator({ _id: resource._id });

  return toAPIUser(creator);
};

export const getResourceSubResourcesResolver: APIResourceResolvers['subResources'] = async resource => {
  return getResourceSubResources(resource._id);
};

export const getResourceSubResourceSeriesResolver: APIResourceResolvers['subResourceSeries'] = async resource => {
  return getResourceSubResourceSeries(resource._id);
};

export const getResourceParentResourcesResolver: APIResourceResolvers['parentResources'] = async resource => {
  return getResourceParentResources(resource._id);
};

export const getResourceSeriesParentResourceResolver: APIResourceResolvers['seriesParentResource'] = async resource => {
  return getResourceSeriesParentResource(resource._id);
};

export const getResourceNextResourceResolver: APIResourceResolvers['nextResource'] = async resource => {
  return getResourceNextResource(resource._id);
};

export const getResourcePreviousResourceResolver: APIResourceResolvers['previousResource'] = async resource => {
  return getResourcePreviousResource(resource._id);
};

export const addSubResourceResolver: APIMutationResolvers['addSubResource'] = async (
  _,
  { parentResourceId, subResourceId },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in to add a sub resource to a resource');
  return await attachSubResourceToResource(parentResourceId, subResourceId);
};

export const createSubResourceSeriesResolver: APIMutationResolvers['createSubResourceSeries'] = async (
  _,
  { parentResourceId, subResourceId },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in to create resource series');
  const existingParent = await getResourceSeriesParentResource(subResourceId);
  if (!!existingParent)
    throw new UserInputError(
      `Resource with _id ${subResourceId} is already part of a series (parent with id ${existingParent._id})`
    );
  return createSubResourceSeries(parentResourceId, subResourceId);
};

export const addSubResourceToSeriesResolver: APIMutationResolvers['addSubResourceToSeries'] = async (
  _,
  { parentResourceId, previousResourceId, subResourceId },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in to create resource series');
  const existingParent = await getResourceSeriesParentResource(subResourceId);
  if (!!existingParent)
    throw new UserInputError(
      `Resource with _id ${subResourceId} is already part of a series (parent with id ${existingParent._id})`
    );
  // In the future, resources would be able to belong to several series:
  // that's why we already pass the parent
  const { previousResource, subResource } = await addSubResourceToSeries(
    parentResourceId,
    previousResourceId,
    subResourceId
  );
  return {
    previousResource,
    subResource,
    seriesParentResource: (await getResourceSeriesParentResource(previousResourceId)) as Resource,
  };
};
