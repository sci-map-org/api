import { Topic } from '../../entities/Topic';
import { findDomainConceptByKey } from '../../repositories/concepts.repository';
import { findDomain } from '../../repositories/domains.repository';
import { findLearningGoal } from '../../repositories/learning_goals.repository';
import { searchSubTopics, searchTopics } from '../../repositories/topics.repository';
import { APIQueryResolvers, APITopicResolvers, TopicType } from '../schema/types';
import { nullToUndefined } from '../util/nullToUndefined';

export const topicResolveType: APITopicResolvers['__resolveType'] = (obj, ctx, info) => {
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
