import { UserInputError } from 'apollo-server-core';
import { NotFoundError } from '../../errors/NotFoundError';
import { getTopicById } from '../../repositories/topics.repository';
import {
  attachTopicTypeToTopic,
  detachTopicTypesFromTopic,
  findOrCreateTopicType,
  findTopicTypes,
  getTopicTypeUsageCount,
} from '../../repositories/topic_types.repository';
import { UnauthenticatedError } from '../errors/UnauthenticatedError';
import { APIMutationResolvers, APIQueryResolvers, APITopicTypeResolvers } from '../schema/types';

const MIN_SEARCH_TOPIC_TYPES_QUERY_LENGTH = 1;
export const searchTopicTypesResolver: APIQueryResolvers['searchTopicTypes'] = async (_parent, { query, limit }) => {
  if (query.length < MIN_SEARCH_TOPIC_TYPES_QUERY_LENGTH)
    throw new UserInputError(
      `Search topic types query must be at least ${MIN_SEARCH_TOPIC_TYPES_QUERY_LENGTH} characters long`
    );
  return await findTopicTypes(query, limit || 10);
};

export const addTopicTypesToTopicResolver: APIMutationResolvers['addTopicTypesToTopic'] = async (
  _parent,
  { topicId, topicTypes },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in to add a topic type');
  await Promise.all(
    topicTypes.map(async (type) => {
      await findOrCreateTopicType(type);
      await attachTopicTypeToTopic(topicId, type);
    })
  );
  const topic = await getTopicById(topicId);
  if (!topic) throw new NotFoundError('Topic', topicId);
  return topic;
};

export const removeTopicTypesFromTopicResolver: APIMutationResolvers['removeTopicTypesFromTopic'] = async (
  _parent,
  { topicId, topicTypes },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in to remove a topic type');
  return await detachTopicTypesFromTopic(topicId, topicTypes);
};

export const getTopicTypeUsageCountResolver: APITopicTypeResolvers['usageCount'] = async (topicType) => {
  return typeof topicType.usageCount === 'number' ? topicType.usageCount : getTopicTypeUsageCount(topicType.name);
};
