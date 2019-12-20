import { APIMutationResolvers, APIQueryResolvers, APIResource } from '../schema/types';
import { UnauthenticatedError } from '../errors/UnauthenticatedError';
import { createResource, attachResourceToDomain, findResource } from '../../repositories/resources.repository';
import { nullToUndefined } from '../util/nullToUndefined';
import { Resource } from '../../entities/Resource';
import { NotFoundError } from '../../errors/NotFoundError';

function toAPIResource(resource: Resource): APIResource {
  return resource;
}

export const createResourceResolver: APIMutationResolvers['createResource'] = async (
  _parent,
  { payload },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in to add a resource');
  const createdResource = await createResource({ _id: user._id }, nullToUndefined(payload));
  return toAPIResource(createdResource);
};

export const addResourceToDomainResolver: APIMutationResolvers['addResourceToDomain'] = async (
  _parent,
  { domainId, payload },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in to add a resource');
  const createdResource = await createResource({ _id: user._id }, nullToUndefined(payload));
  await attachResourceToDomain(createdResource._id, domainId);
  return toAPIResource(createdResource);
};

export const attachResourceToDomainResolver: APIMutationResolvers['attachResourceToDomain'] = async (
  _parent,
  { domainId, resourceId },
  ctx
) => {
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
