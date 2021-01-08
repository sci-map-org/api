import { UserInputError } from 'apollo-server-koa';
import { NotFoundError } from '../../errors/NotFoundError';
import {
  attachDomainBelongsToDomain,
  createDomain,
  deleteDomain,
  detachDomainBelongsToDomain,
  findDomain,
  getDomainConcepts,
  getDomainLearningGoals,
  getDomainLearningMaterials,
  getDomainParentDomains,
  getDomainPublicLearningPaths,
  getDomainResources,
  getDomainSubDomains,
  getDomainSubTopics,
  searchDomains,
  updateDomain,
} from '../../repositories/domains.repository';
import {
  APIDomainLearningMaterialsSortingType,
  APIDomainResolvers,
  APIMutationResolvers,
  APIQueryResolvers,
} from '../schema/types';
import { restrictAccess } from '../util/auth';
import { nullToUndefined } from '../util/nullToUndefined';
import { toAPIResource } from './resources.resolvers';

export const searchDomainsResolver: APIQueryResolvers['searchDomains'] = async (
  _parent,
  { options: { query, pagination } }
) => {
  const domains = await searchDomains(nullToUndefined({ query }), nullToUndefined(pagination));
  return { items: domains };
};

export const createDomainResolver: APIMutationResolvers['createDomain'] = async (_parent, { payload }, { user }) => {
  restrictAccess('contributorOrAdmin', user, 'Must be logged in and an admin or a contributor to create a domain');
  return await createDomain({ _id: user!._id }, nullToUndefined(payload));
};

export const getDomainByKeyResolver: APIQueryResolvers['getDomainByKey'] = async (_parent, { key }) => {
  const domain = await findDomain({ key });
  if (!domain) throw new NotFoundError('Domain', key, 'key');
  return domain;
};

export const updateDomainResolver: APIMutationResolvers['updateDomain'] = async (
  _parent,
  { id, payload },
  { user }
) => {
  restrictAccess('contributorOrAdmin', user, 'Must be logged in and an admin or a contributor to update a domain');
  const updatedDomain = await updateDomain({ _id: id }, nullToUndefined(payload));
  if (!updatedDomain) throw new NotFoundError('Domain', id, 'id');
  return updatedDomain;
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
  // can't filter for consumed ones when no users
  if (!user && options.filter.consumedByUser === true)
    throw new UserInputError('getDomainResources : no user yet consumedByUser filter is set to true');

  return {
    items: (await getDomainResources(domain._id, user?._id, nullToUndefined(options))).map(toAPIResource),
  };
};

export const getDomainLearningPathsResolver: APIDomainResolvers['learningPaths'] = async (domain, { options }, ctx) => {
  const { sorting } = options;
  return {
    items: await getDomainPublicLearningPaths({ _id: domain._id }, sorting || undefined),
  };
};

export const getDomainLearningMaterialsResolver: APIDomainResolvers['learningMaterials'] = async (
  domain,
  { options },
  { user }
) => {
  if (!user && options.filter.completedByUser === true) return { items: [] };
  if (
    options.sortingType === APIDomainLearningMaterialsSortingType.Recommended &&
    options.filter.completedByUser === undefined
  )
    throw new UserInputError(
      'getDomainLearningMaterials : when using recommendations, completedByUser Filter must be set'
    );
  return {
    items: (await getDomainLearningMaterials(domain._id, user?._id, nullToUndefined(options))).map(toAPIResource),
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

export const getDomainLearningGoalsResolver: APIDomainResolvers['learningGoals'] = async domain => {
  return (await getDomainLearningGoals(domain._id)).map(({ learningGoal, relationship, domain }) => ({
    learningGoal,
    ...relationship,
    domain,
  }));
};

export const getDomainSubTopicsResolver: APIDomainResolvers['subTopics'] = async domain => {
  const result = await getDomainSubTopics(domain._id);
  if (!result) throw new NotFoundError('Domain', domain._id);
  return result.subTopics.map(({ topic, relationship }) => ({
    topic,
    ...relationship,
    domain: result.domain,
  }));
};
