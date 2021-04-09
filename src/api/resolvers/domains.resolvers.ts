import { UserInputError } from 'apollo-server-koa';
import { NotFoundError } from '../../errors/NotFoundError';
import {
  countDomainConcepts,
  countDomainLearningMaterials,
  createDomain,
  deleteDomain,
  findDomain,
  getDomainConcepts,
  getDomainLearningGoals,
  getDomainLearningMaterials,
  getDomainPublicLearningPaths,
  getDomainResources,
  searchDomains,
  updateDomain,
} from '../../repositories/domains.repository';
import { getTopicParentTopics, getTopicSize } from '../../repositories/topics.repository';
import {
  APIDomainLearningMaterialsSortingType,
  APIDomainResolvers,
  APIMutationResolvers,
  APIQueryResolvers,
} from '../schema/types';
import { restrictAccess } from '../util/auth';
import { nullToUndefined } from '../util/nullToUndefined';
import { toAPIResource } from './resources.resolvers';
import { getTopicSubTopicsResolver } from './topics.resolvers';

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
  return {
    items: await getDomainConcepts({ _id: domain._id }, sorting || undefined),
  };
};

export const getDomainConceptTotalCountResolver: APIDomainResolvers['conceptTotalCount'] = async (domain, _, ctx) => {
  return countDomainConcepts({ _id: domain._id });
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

export const getDomainLearningMaterialsTotalCountResolver: APIDomainResolvers['learningMaterialsTotalCount'] = async domain => {
  return await countDomainLearningMaterials(domain._id);
};

export const getDomainLearningGoalsResolver: APIDomainResolvers['learningGoals'] = async domain => {
  return (await getDomainLearningGoals(domain._id)).map(({ learningGoal, relationship, domain }) => ({
    learningGoal,
    ...relationship,
    domain,
  }));
};

export const getDomainSubTopicsResolver: APIDomainResolvers['subTopics'] = getTopicSubTopicsResolver;

export const getDomainParentTopicsResolver: APIDomainResolvers['parentTopics'] = async (topic, { options }) => {
  const result = await getTopicParentTopics(
    topic._id,
    options.sorting,
    options.topicTypeIn ? { topicTypeIn: options.topicTypeIn } : undefined
  );
  return result.map(({ parentTopic, subTopic, relationship }) => ({
    subTopic,
    ...relationship,
    parentTopic,
  }));
};

export const getDomainSizeResolver: APIDomainResolvers['size'] = async domain => {
  return getTopicSize(domain._id);
};
