import { APIMutationResolvers, APIQueryResolvers, APIResource, APIResourceResolvers } from '../schema/types';
import { UnauthenticatedError } from '../errors/UnauthenticatedError';
import {
  createResource,
  attachResourceToDomain,
  findResource,
  attachResourceCoversConcepts,
  detachResourceCoversConcepts,
  getResourceCoveredConcepts,
  updateResource,
  getResourceDomains,
} from '../../repositories/resources.repository';
import { nullToUndefined } from '../util/nullToUndefined';
import { Resource } from '../../entities/Resource';
import { NotFoundError } from '../../errors/NotFoundError';
import {
  getResourceResourceTags,
  findOrCreateResourceTag,
  attachResourceTagsToResource,
} from '../../repositories/resource_tag.repository';
import { omit, uniqBy } from 'lodash';
import { createAndSaveResource } from '../../services/auth/resources.service';

export function toAPIResource(resource: Resource): APIResource {
  return resource;
}

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
  const updatedResource = await updateResource({ _id }, nullToUndefined(payload));
  if (!updatedResource) throw new NotFoundError('Resource', _id, 'id');
  return toAPIResource(updatedResource);
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
  await attachResourceToDomain(domainId, resourceId);
  const resource = await findResource({ _id: resourceId });
  if (!resource) throw new NotFoundError('Resource', resourceId, '_id');
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
  if (!user) throw new UnauthenticatedError('Must be logged in to add a resource');
  const resource = await attachResourceCoversConcepts(resourceId, conceptIds, { userId: user._id });
  if (!resource) throw new NotFoundError('Resource', resourceId, '_id');
  return toAPIResource(resource);
};

export const detachResourceCoversConceptsResolver: APIMutationResolvers['detachResourceCoversConcepts'] = async (
  _parent,
  { resourceId, conceptIds },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in to add a resource');
  const resource = await detachResourceCoversConcepts(resourceId, conceptIds);
  if (!resource) throw new NotFoundError('Resource', resourceId, '_id');
  return toAPIResource(resource);
};

export const getResourceCoveredConceptsResolver: APIResourceResolvers['coveredConcepts'] = async (
  resource,
  { options }
) => {
  return {
    items: await getResourceCoveredConcepts(resource._id),
  };
};

export const getResourceDomainsResolver: APIResourceResolvers['domains'] = async (resource, { options }) => {
  return {
    items: await getResourceDomains(resource._id),
  };
};

export const getResourceTagsResolver: APIResourceResolvers['tags'] = async resource => {
  return await getResourceResourceTags(resource._id);
};
