import { searchSubTopics, searchTopics } from '../../repositories/topics.repository';
import { APIQueryResolvers, APITopicResolvers } from '../schema/types';
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
