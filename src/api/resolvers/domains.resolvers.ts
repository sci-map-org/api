import { Domain } from '../../entities/Domain';
import { NotFoundError } from '../../errors/NotFoundError';
import {
  createDomain,
  deleteDomain,
  findDomain,
  getDomainConcepts,
  searchDomains,
  updateDomain,
  attachDomainBelongsToDomain,
  detachDomainBelongsToDomain,
  getDomainParentDomains,
  getDomainSubDomains,
  getDomainLearningPaths,
} from '../../repositories/domains.repository';
import { getDomainResources } from '../../repositories/domains.repository';
import { APIDomain, APIDomainResolvers, APIMutationResolvers, APIQueryResolvers } from '../schema/types';
import { restrictAccess } from '../util/auth';
import { nullToUndefined } from '../util/nullToUndefined';
import { toAPIResource } from './resources.resolvers';

function toAPIDomain(domain: Domain): APIDomain {
  return domain;
}

export const searchDomainsResolver: APIQueryResolvers['searchDomains'] = async (
  _parent,
  { options: { query, pagination } }
) => {
  const domains = await searchDomains(nullToUndefined({ query }), nullToUndefined(pagination));
  return { items: domains.map(toAPIDomain) };
};

export const createDomainResolver: APIMutationResolvers['createDomain'] = async (_parent, { payload }, { user }) => {
  restrictAccess('contributorOrAdmin', user, 'Must be logged in and an admin or a contributor to create a domain');
  const createdDomain = await createDomain({ _id: user!._id }, nullToUndefined(payload));
  return toAPIDomain(createdDomain);
};

export const getDomainByKeyResolver: APIQueryResolvers['getDomainByKey'] = async (_parent, { key }) => {
  const domain = await findDomain({ key });
  if (!domain) throw new NotFoundError('Domain', key, 'key');
  return toAPIDomain(domain);
};

export const updateDomainResolver: APIMutationResolvers['updateDomain'] = async (
  _parent,
  { id, payload },
  { user }
) => {
  restrictAccess('contributorOrAdmin', user, 'Must be logged in and an admin or a contributor to update a domain');
  const updatedDomain = await updateDomain({ _id: id }, nullToUndefined(payload));
  if (!updatedDomain) throw new NotFoundError('Domain', id, 'id');
  return toAPIDomain(updatedDomain);
};

export const deleteDomainResolver: APIMutationResolvers['deleteDomain'] = async (_parent, { id }, { user }) => {
  restrictAccess('admin', user, 'Must be logged in and an admin to delete a domain');
  const { deletedCount } = await deleteDomain({ _id: id });
  if (!deletedCount) throw new NotFoundError('Domain', id, 'id');
  return { _id: id, success: true };
};

export const getDomainConceptsResolver: APIDomainResolvers['concepts'] = async (domain, { options }, ctx) => {
  const { sorting } = options;
  return { items: await getDomainConcepts({ _id: domain._id }, sorting || undefined) };
};

export const getDomainResourcesResolver: APIDomainResolvers['resources'] = async (domain, { options }, { user }) => {
  return {
    items: (await getDomainResources(domain._id, user?._id, nullToUndefined(options))).map(toAPIResource),
  };
};

export const getDomainLearningPathsResolver: APIDomainResolvers['learningPaths'] = async (domain, { options }, ctx) => {
  const { sorting } = options;
  return {
    items: await getDomainLearningPaths({ _id: domain._id }, sorting || undefined),
  };
};

export const addDomainBelongsToDomainResolver: APIMutationResolvers['addDomainBelongsToDomain'] = async (
  _p,
  { parentDomainId, subDomainId },
  { user }
) => {
  restrictAccess(
    'contributorOrAdmin',
    user,
    'Must be logged in and an admin or contributor to modify Domain grouping relationships'
  );

  const { parentDomain } = await attachDomainBelongsToDomain(parentDomainId, subDomainId);
  return parentDomain;
};
export const removeDomainBelongsToDomainResolver: APIMutationResolvers['removeDomainBelongsToDomain'] = async (
  _p,
  { parentDomainId, subDomainId },
  { user }
) => {
  restrictAccess(
    'contributorOrAdmin',
    user,
    'Must be logged in and an admin or contributor to modify Domain grouping relationships'
  );
  const { parentDomain } = await detachDomainBelongsToDomain(parentDomainId, subDomainId);
  return parentDomain;
};

export const getDomainSubDomainsResolver: APIDomainResolvers['subDomains'] = async domain => {
  return getDomainSubDomains({ _id: domain._id });
};
export const getDomainParentDomainsResolver: APIDomainResolvers['parentDomains'] = async domain => {
  return getDomainParentDomains({ _id: domain._id });
};
