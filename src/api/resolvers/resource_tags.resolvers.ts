import { APIQueryResolvers, APIMutationResolvers } from '../schema/types';
import {
  findResourceTags,
  attachResourceTagsToResource,
  findOrCreateResourceTag,
  detachResourceTagsFromResource,
} from '../../repositories/resource_tags.repository';
import { nullToUndefined } from '../util/nullToUndefined';
import { findResource } from '../../repositories/resources.repository';
import { NotFoundError } from '../../errors/NotFoundError';
import { UnauthenticatedError } from '../errors/UnauthenticatedError';

export const searchResourceTagsResolver: APIQueryResolvers['searchResourceTags'] = async (_parent, { options }) => {
  return await findResourceTags(options.query, nullToUndefined(options.pagination));
};

export const addTagsToResourceResolver: APIMutationResolvers['addTagsToResource'] = async (
  _parent,
  { resourceId, tags },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in to add a resource tag');
  await Promise.all(tags.map(tag => findOrCreateResourceTag(tag)));
  await attachResourceTagsToResource(resourceId, tags);
  const resource = await findResource({ _id: resourceId });
  if (!resource) throw new NotFoundError('Resource', resourceId);
  return resource;
};

export const removeTagsFromResourceResolver: APIMutationResolvers['removeTagsFromResource'] = async (
  _parent,
  { resourceId, tags },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in to remove a resource tag');
  const resource = await detachResourceTagsFromResource(resourceId, tags);
  return resource;
};
