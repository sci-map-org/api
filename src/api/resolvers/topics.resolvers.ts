import { SUBTOPIC_DEFAULT_INDEX_VALUE } from '../../entities/relationships/TopicIsSubTopicOfTopic';
import { Topic } from '../../entities/Topic';
import { findDomainConceptByKey } from '../../repositories/concepts.repository';
import { findDomain } from '../../repositories/domains.repository';
import { findLearningGoal } from '../../repositories/learning_goals.repository';
import {
  attachTopicIsSubTopicOfTopic,
  detachTopicIsSubTopicOfTopic,
  getTopicSubTopics,
  searchSubTopics,
  searchTopics,
  updateTopicIsSubTopicOfTopic,
} from '../../repositories/topics.repository';
import { APIITopicResolvers, APIMutationResolvers, APIQueryResolvers, TopicType } from '../schema/types';
import { restrictAccess } from '../util/auth';
import { nullToUndefined } from '../util/nullToUndefined';

export const topicResolveType: APIITopicResolvers['__resolveType'] = (obj, ctx, info) => {
  return obj.topicType;
};

export const searchTopicsResolver: APIQueryResolvers['searchTopics'] = async (_, { options }) => {
  const { pagination, query } = options;
  return {
    items: await searchTopics(query, nullToUndefined(pagination)),
  };
};

export const searchSubTopicsResolver: APIQueryResolvers['searchSubTopics'] = async (_, { domainId, options }) => {
  const { query, pagination, filter } = options;
  return {
    items: await searchSubTopics(domainId, query, nullToUndefined(pagination), filter?.topicTypeIn || undefined),
  };
};

const getTopicByKeyMapping: { [key in TopicType]: (key: string, domainId?: string) => Promise<Topic | null> } = {
  [TopicType.Concept]: (key: string, domainKey: string) => findDomainConceptByKey(domainKey, key),
  [TopicType.Domain]: (key: string) => findDomain({ key }),
  [TopicType.LearningGoal]: (key: string) => findLearningGoal({ key }),
};

export const checkTopicKeyAvailabilityResolver: APIQueryResolvers['checkTopicKeyAvailability'] = async (
  _,
  { key, topicType, domainKey }
) => {
  let existingTopic = await getTopicByKeyMapping[topicType](key, domainKey || undefined);
  return {
    available: !existingTopic,
    existingTopic,
  };
};

export const attachTopicIsSubTopicOfTopicResolver: APIMutationResolvers['attachTopicIsSubTopicOfTopic'] = async (
  _,
  { parentTopicId, subTopicId, payload },
  { user }
) => {
  restrictAccess('loggedInUser', user, 'Must be logged in');

  const { parentTopic, subTopic, relationship } = await attachTopicIsSubTopicOfTopic(parentTopicId, subTopicId, {
    index: payload.index || SUBTOPIC_DEFAULT_INDEX_VALUE,
    createdByUserId: user?._id,
  });
  return { parentTopic, subTopic, ...relationship };
};

export const updateTopicIsSubTopicOfTopicResolver: APIMutationResolvers['updateTopicIsSubTopicOfTopic'] = async (
  _,
  { parentTopicId, subTopicId, payload },
  { user }
) => {
  restrictAccess('loggedInUser', user, 'Must be logged in');

  const { parentTopic, subTopic, relationship } = await updateTopicIsSubTopicOfTopic(parentTopicId, subTopicId, {
    index: payload.index || undefined,
  });
  return { parentTopic, subTopic, ...relationship };
};

export const detachTopicIsSubTopicOfTopicResolver: APIMutationResolvers['detachTopicIsSubTopicOfTopic'] = async (
  _,
  { parentTopicId, subTopicId },
  { user }
) => {
  restrictAccess('contributorOrAdmin', user, 'Must be logged in');

  return await detachTopicIsSubTopicOfTopic(parentTopicId, subTopicId);
};

export const getTopicSubTopicsResolver: APIITopicResolvers['subTopics'] = async (topic, { options }) => {
  const result = await getTopicSubTopics(
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
