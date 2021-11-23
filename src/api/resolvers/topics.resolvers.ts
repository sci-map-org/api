import { UserInputError } from 'apollo-server-errors';
import { TopicLabel } from '../../entities/Topic';
import { NotFoundError } from '../../errors/NotFoundError';
import {
  attachTopicIsSubTopicOfTopic,
  detachTopicIsSubTopicOfTopic,
  getTopicById,
  getTopicByKey,
  getTopicCreator,
  getTopicFollowUps,
  getTopicParentTopic,
  getTopicPrerequisites,
  getTopicSubTopics,
  getTopicSubTopicsTotalCount,
  searchSubTopics,
  searchTopics,
  updateTopicIsSubTopicOfTopic
} from '../../repositories/topics.repository';
import { initSubtopicIndexValue } from '../../services/topics.service';
import { APIMutationResolvers, APIQueryResolvers, APITopicResolvers } from '../schema/types';
import { restrictAccess } from '../util/auth';
import { nullToUndefined } from '../util/nullToUndefined';

// export const topicResolveType: APITopicResolvers['__resolveType'] = (obj, ctx, info) => {
//   return obj.topicType;
// };

export const getTopicByIdResolver: APIQueryResolvers['getTopicById'] = async (_, { topicId }) => {
  const topic = await getTopicById(topicId);
  if (!topic) throw new NotFoundError(TopicLabel, topicId);
  return topic;
};

export const getTopicByKeyResolver: APIQueryResolvers['getTopicByKey'] = async (_, { topicKey }) => {
  const topic = await getTopicByKey(topicKey);
  if (!topic) throw new NotFoundError(TopicLabel, topicKey, 'key');
  return topic;
};

export const searchTopicsResolver: APIQueryResolvers['searchTopics'] = async (_, { options }) => {
  const { pagination, query } = options;
  return {
    items: await searchTopics(query, nullToUndefined(pagination)),
  };
};

export const searchSubTopicsResolver: APIQueryResolvers['searchSubTopics'] = async (_, { topicId, options }) => {
  const { query, pagination } = options;
  return {
    items: await searchSubTopics(topicId, query, nullToUndefined(pagination)),
  };
};


export const checkTopicKeyAvailabilityResolver: APIQueryResolvers['checkTopicKeyAvailability'] = async (
  _,
  { key}
) => {
  let existingTopic = await getTopicByKey(key);
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
  const existingParentTopic = await getTopicParentTopic(subTopicId)
  if(!!existingParentTopic) throw new UserInputError(`Topic ${subTopicId} already has a parent topic`)

  const { parentTopic, subTopic, relationship } = await attachTopicIsSubTopicOfTopic(parentTopicId, subTopicId, {
    index: payload.index || (await initSubtopicIndexValue(parentTopicId)),
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


// TODO : create, update, delete topic
// TODO : set known / unknown

export const getTopicParentTopicResolver: APITopicResolvers['parentTopic'] =async (topic) => {
   const parent = await getTopicParentTopic(topic._id)
   return parent?.parentTopic || null
}

export const getTopicSubTopicsResolver: APITopicResolvers['subTopics'] = async (topic, { options }) => {
  const result = await getTopicSubTopics(
    topic._id,
    options.sorting,
  );
  return result.map(({ parentTopic, subTopic, relationship }) => ({
    subTopic,
    ...relationship,
    parentTopic,
  }));
};

export const getTopicSubTopicsTotalCountResolver: APITopicResolvers['subTopicsTotalCount'] = async(topic) => {
  const size = await getTopicSubTopicsTotalCount(topic._id)
  return size
}

// TODO
export const getTopicLearningMaterialsResolver: APITopicResolvers['learningMaterials'] = async (topic, {options}) => {
  return {
    items: []
  }
}

// TODO
export const getTopicLearningMaterialsTotalCountResolver: APITopicResolvers['learningMaterialsTotalCount'] = async (topic) => {
  return 0
}

export const getTopicPrerequisitesResolver: APITopicResolvers['prerequisites'] = async (topic) => {
  return getTopicPrerequisites({_id: topic._id})
}

export const getTopicFollowUpsResolver: APITopicResolvers['followUps'] = async (topic) => {
  return getTopicFollowUps({_id: topic._id})
}

export const getTopicsCreatedByResolver: APITopicResolvers['createdBy'] = async (topic) => {
  return getTopicCreator({ _id: topic._id });
}