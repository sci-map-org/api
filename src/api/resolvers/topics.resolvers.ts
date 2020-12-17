import { APITopicResolvers } from '../schema/types';

// TODO -> options ?
export const topicResolveType: APITopicResolvers['__resolveType'] = (obj, ctx, info) => {
  return obj.topicType;
};
