import { UserInputError } from 'apollo-server-koa';
import { Resource } from '../../entities/Resource';
import { NotFoundError } from '../../errors/NotFoundError';
import { getLearningMaterialRating } from '../../repositories/learning_materials.repository';
import { getLearningMaterialTags } from '../../repositories/learning_material_tags.repository';
import {
  addSubResourceToSeries,
  attachSubResourceToResource,
  createSubResourceSeries,
  deleteResource,
  deleteResourceCreatedBy,
  findResource,
  getResourceNextResource,
  getResourceParentResources,
  getResourcePreviousResource,
  getResourceSeriesParentResource,
  getResourceSubResources,
  getResourceSubResourceSeries,
  getUserConsumedResource,
  searchResources,
  updateResource,
} from '../../repositories/resources.repository';
import { attachUserConsumedResources } from '../../repositories/users.repository';
import { createAndSaveResource } from '../../services/resources.service';
import { analyzeResourceUrl } from '../../services/url_analyzer.service';
import { hasAccess } from '../../services/users.service';
import { UnauthenticatedError } from '../errors/UnauthenticatedError';
import { APIMutationResolvers, APIQueryResolvers, APIResource, APIResourceResolvers } from '../schema/types';
import { nullToUndefined } from '../util/nullToUndefined';
import { toAPIUser } from './users.resolvers';

const SEARCH_RESOURCES_MIN_QUERY_LENGTH = 3;

export const searchResourcesResolver: APIQueryResolvers['searchResources'] = async (_parent, { query, options }) => {
  if (query.length < SEARCH_RESOURCES_MIN_QUERY_LENGTH)
    throw new UserInputError(`Must have at least ${SEARCH_RESOURCES_MIN_QUERY_LENGTH} characters in the search query`);
  return {
    items: await searchResources(query, nullToUndefined(options)),
  };
};

export const analyzeResourceUrlResolver: APIQueryResolvers['analyzeResourceUrl'] = async (_parent, { url }) => {
  return { resourceData: await analyzeResourceUrl(url) };
};

export const createResourceResolver: APIMutationResolvers['createResource'] = async (
  _parent,
  { payload },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in to add a resource');
  return await createAndSaveResource(nullToUndefined(payload), user._id);
};

export const updateResourceResolver: APIMutationResolvers['updateResource'] = async (
  _parent,
  { resourceId, payload },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in to update a resource');
  const updatedResource = await updateResource(
    { _id: resourceId },
    { ...nullToUndefined(payload), durationSeconds: payload.durationSeconds }
  );
  if (!updatedResource) throw new NotFoundError('Resource', resourceId);
  return updatedResource;
};

export const deleteResourceResolver: APIMutationResolvers['deleteResource'] = async (
  _parent,
  { resourceId },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in to delete a resource');

  const { deletedCount } = hasAccess('contributorOrAdmin', user)
    ? await deleteResource({ _id: resourceId })
    : await deleteResourceCreatedBy({ _id: user._id }, resourceId);
  if (!deletedCount) throw new NotFoundError('Resource', resourceId);
  return {
    success: true,
    _id: resourceId,
  };
};

export const getResourceByIdResolver: APIQueryResolvers['getResourceById'] = async (_parent, { resourceId }) => {
  const resource = await findResource({ _id: resourceId });
  if (!resource) throw new NotFoundError('Resource', resourceId);
  return resource;
};

export const getResourceTagsResolver: APIResourceResolvers['tags'] = async (resource) => {
  return await getLearningMaterialTags(resource._id);
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

  const resourcesToConsumeData = await Promise.all(
    payload.resources.map(async (resourcePayload) => {
      const relationship = await getUserConsumedResource(user._id, resourcePayload.resourceId);
      return {
        resourceId: resourcePayload.resourceId,
        ...(resourcePayload.opened === true && {
          openedAt: relationship && relationship.openedAt ? undefined : Date.now(),
          lastOpenedAt: Date.now(),
        }),
        ...(resourcePayload.consumed !== undefined && { consumedAt: resourcePayload.consumed ? Date.now() : null }),
      };
    })
  );
  await attachUserConsumedResources(user._id, resourcesToConsumeData);
  return resources;
};

export const getResourceConsumedResolver: APIResourceResolvers['consumed'] = async (resource, _args, { user }) => {
  if (!user) return null;
  return await getUserConsumedResource(user._id, resource._id);
};

export const getResourceRatingResolver: APIResourceResolvers['rating'] = async (resource) =>
  getLearningMaterialRating(resource._id);

export const getResourceSubResourcesResolver: APIResourceResolvers['subResources'] = async (resource) => {
  return getResourceSubResources(resource._id);
};

export const getResourceSubResourceSeriesResolver: APIResourceResolvers['subResourceSeries'] = async (resource) => {
  return getResourceSubResourceSeries(resource._id);
};

export const getResourceParentResourcesResolver: APIResourceResolvers['parentResources'] = async (resource) => {
  return getResourceParentResources(resource._id);
};

export const getResourceSeriesParentResourceResolver: APIResourceResolvers['seriesParentResource'] = async (
  resource
) => {
  return getResourceSeriesParentResource(resource._id);
};

export const getResourceNextResourceResolver: APIResourceResolvers['nextResource'] = async (resource) => {
  return getResourceNextResource(resource._id);
};

export const getResourcePreviousResourceResolver: APIResourceResolvers['previousResource'] = async (resource) => {
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
