import { UserInputError } from 'apollo-server-errors';
import { pick } from 'lodash';
import { Topic, TopicLabel } from '../../entities/Topic';
import { NotFoundError } from '../../errors/NotFoundError';
import {
  attachTopicHasContextTopic,
  attachTopicHasDisambiguationTopic,
  autocompleteTopicName,
  countLearningMaterialsShowedInTopic,
  createTopic,
  deleteTopic,
  getTopicById,
  getTopicByKey,
  getTopicContextTopic,
  getTopicContextualisedTopics,
  getTopicCreator,
  getTopicDisambiguationTopic,
  getTopicFollowUps,
  getTopicLearningMaterials,
  getTopicLearningMaterialsTagsFilters,
  getTopicParentTopic,
  getTopicPartOfTopics,
  getTopicPrerequisites,
  getTopicSubTopics,
  getTopicSubTopicsTotalCount,
  getTopicsValidContexts,
  getTopicsValidContextsFromDisambiguation,
  getTopicValidContextsFromSameName,
  searchSubTopics,
  searchTopics,
  updateTopic,
  updateTopicHasContextTopic,
  updateTopicTopicTypes,
} from '../../repositories/topics.repository';
import { getTopicTopicTypes } from '../../repositories/topic_types.repository';
import { pullTopicDescriptions } from '../../services/pull_topic_descriptions.service';
import { createFullTopic } from '../../services/topics.service';
import { UnauthenticatedError } from '../errors/UnauthenticatedError';
import {
  APIMutationResolvers,
  APIQueryResolvers,
  APITopicLearningMaterialsSortingType,
  APITopicResolvers,
} from '../schema/types';
import { restrictAccess } from '../util/auth';
import { nullToUndefined } from '../util/nullToUndefined';

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

export const autocompleteTopicNameResolver: APIQueryResolvers['autocompleteTopicName'] = async (_, { partialName }) => {
  return {
    items: await autocompleteTopicName(partialName, { offset: 0, limit: 10 }),
  };
};

export const getTopicValidContextsResolver: APIQueryResolvers['getTopicValidContexts'] = async (
  _,
  { parentTopicId, topicId }
) => {
  return getTopicsValidContexts(parentTopicId, topicId);
};
export const getTopicValidContextsFromSameNameResolver: APIQueryResolvers['getTopicValidContextsFromSameName'] = async (
  _,
  { parentTopicId, existingSameNameTopicId }
) => {
  return getTopicValidContextsFromSameName(parentTopicId, existingSameNameTopicId);
};

export const getTopicValidContextsFromDisambiguationResolver: APIQueryResolvers['getTopicValidContextsFromDisambiguation'] =
  async (_, { parentTopicId, disambiguationTopicId }) => {
    return getTopicsValidContextsFromDisambiguation(parentTopicId, disambiguationTopicId);
  };

export const checkTopicKeyAvailabilityResolver: APIQueryResolvers['checkTopicKeyAvailability'] = async (_, { key }) => {
  let existingTopic = await getTopicByKey(key);
  return {
    available: !existingTopic,
    existingTopic,
  };
};

export const pullTopicDescriptionsResolver: APIQueryResolvers['pullTopicDescriptions'] = async (
  _parent,
  { queryOptions }
) => {
  return pullTopicDescriptions(queryOptions);
};

export const createTopicResolver: APIMutationResolvers['createTopic'] = async (_parent, { payload }, { user }) => {
  if (!user) throw new UnauthenticatedError('Must be logged in to create a topic');

  return createFullTopic(payload, user);
};

export const addSubTopicResolver: APIMutationResolvers['addSubTopic'] = async (
  _parent,
  { parentTopicId, payload, contextOptions },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in to create a topic');
  return createFullTopic(payload, user, {
    parentTopicId,
    contextOptions: contextOptions || undefined,
  });
};

export const createDisambiguationFromTopicResolver: APIMutationResolvers['createDisambiguationFromTopic'] = async (
  _,
  { existingTopicId, existingTopicContextTopicId },
  { user }
) => {
  restrictAccess('loggedInUser', user, 'Must be logged in to create a topic');
  const existingTopic = await getTopicById(existingTopicId);
  const existingTopicContext = await getTopicById(existingTopicContextTopicId);

  if (!existingTopic) throw new NotFoundError('Topic', existingTopicId);
  if (!existingTopicContext) throw new NotFoundError('Topic', existingTopicContextTopicId);

  const disambiguationTopic = await createTopic(
    { _id: user!._id },
    {
      name: existingTopic.name,
      key: existingTopic.key + '_temp',
      isDisambiguation: true,
    }
  );
  await attachTopicHasDisambiguationTopic(existingTopic._id, disambiguationTopic._id, {
    createdByUserId: user!._id,
  });
  await attachTopicHasContextTopic(existingTopic._id, existingTopicContextTopicId, { createdByUserId: user!._id });
  await updateTopic({ _id: disambiguationTopic._id }, { key: existingTopic.key });
  return disambiguationTopic;
};

export const updateTopicResolver: APIMutationResolvers['updateTopic'] = async (
  _parent,
  { topicId, payload },
  { user }
) => {
  restrictAccess('loggedInUser', user, 'Must be logged in to update a topic');
  const updatedTopic = await updateTopic(
    { _id: topicId },
    {
      ...nullToUndefined(payload),
      level: payload.level,
      aliases: payload.aliases,
      descriptionSourceUrl: payload.descriptionSourceUrl,
      wikipediaPageUrl: payload.wikipediaPageUrl,
    }
  );
  if (!updatedTopic) throw new NotFoundError('Topic', topicId);
  return updatedTopic;
};

export const updateTopicTopicTypesResolver: APIMutationResolvers['updateTopicTopicTypes'] = async (
  _parent,
  { topicId, topicTypesNames }
) => {
  if (!topicTypesNames.length) throw new Error('Must have at least one topic type');
  const results = await updateTopicTopicTypes(
    topicId,
    topicTypesNames.map((name) => name.toLowerCase())
  );
  if (!results.length) throw new NotFoundError('Topic', topicId);
  return results[0].topic;
};

export const deleteTopicResolver: APIMutationResolvers['deleteTopic'] = async (_parent, { topicId }, { user }) => {
  restrictAccess('contributorOrAdmin', user, 'Must be logged in and a contributor or an admin to delete a topic');
  const { deletedCount } = await deleteTopic({ _id: topicId });
  if (!deletedCount) throw new NotFoundError('Topic', topicId);
  return { _id: topicId, success: true };
};

export const updateTopicContextResolver: APIMutationResolvers['updateTopicContext'] = async (
  _,
  { topicId, contextTopicId },
  { user }
) => {
  restrictAccess('loggedInUser', user, 'Must be logged in to ');
  // get topic, its parent and current context
  const topic = await getTopicById(topicId);
  if (!topic) throw new NotFoundError('Topic', topicId);

  const parentTopic = (await getTopicParentTopic(topicId))?.parentTopic;
  if (!parentTopic) throw new Error('Topic must have a parent in order to set a context');

  const currentContextTopic = (await getTopicContextTopic(topicId))?.contextTopic;

  // get requested context
  const newContextTopic = await getTopicById(contextTopicId);
  if (!newContextTopic) throw new NotFoundError('Topic', contextTopicId);

  // get valid contexts => if new is not in those, throw
  const { validContexts } = await getTopicsValidContexts(parentTopic._id, topicId);
  if (!validContexts.find((validContext) => validContext._id === newContextTopic._id))
    throw new Error('new context is not valid');

  // detach current and attach new one
  if (currentContextTopic) {
    const { topic } = await updateTopicHasContextTopic(topicId, newContextTopic._id, { createdByUserId: user!._id });
    return topic;
  } else {
    const { topic } = await attachTopicHasContextTopic(topicId, contextTopicId, { createdByUserId: user!._id });
    return topic;
  }
};
// TODO : set known / unknown
// export const getTopicKnownResolver: APIConceptResolvers['known'] = async (parentConcept, _args, { user }) => {
//   if (!user) return null;
//   return await getUserKnowsConcept(user._id, parentConcept._id);
// };

// export const setConceptsKnownResolver: APIMutationResolvers['setConceptsKnown'] = async (_p, { payload }, { user }) => {
//   restrictAccess('loggedInUser', user, 'Must be logged in to know a concept');
//   const concepts = await Promise.all(
//     payload.concepts.map(async c => {
//       const foundConcept = await findConcept({ _id: c.conceptId });
//       if (!foundConcept) throw new NotFoundError('Concept', c.conceptId);
//       return foundConcept;
//     })
//   );
//   await attachUserKnowsConcepts(user!._id, payload.concepts);
//   return concepts.map(toAPIConcept);
// };

// export const setConceptsUnKnownResolver: APIMutationResolvers['setConceptsUnknown'] = async (
//   _p,
//   { conceptIds },
//   { user }
// ) => {
//   restrictAccess('loggedInUser', user, 'Must be logged in to unknow a concept');
//   const concepts = await Promise.all(
//     conceptIds.map(async conceptId => {
//       const foundConcept = await findConcept({ _id: conceptId });
//       if (!foundConcept) throw new NotFoundError('Concept', conceptId);
//       return foundConcept;
//     })
//   );
//   await detachUserKnowsConcepts(user!._id, conceptIds);
//   return concepts.map(toAPIConcept);
// };

export const getTopicAliasesResolver: APITopicResolvers['aliases'] = async (topic: Topic) => {
  return topic.aliasesJson ? JSON.parse(topic.aliasesJson) : null;
};

export const getTopicParentTopicResolver: APITopicResolvers['parentTopic'] = async (topic) => {
  const parent = await getTopicParentTopic(topic._id);
  return parent?.parentTopic || null;
};

export const getTopicSubTopicsResolver: APITopicResolvers['subTopics'] = async (topic) => {
  const result = await getTopicSubTopics(topic._id);
  return result.map(({ parentTopic, subTopic, relationship, relationshipType }) => ({
    subTopic,
    ...relationship,
    relationshipType,
    parentTopic,
  }));
};

export const getTopicSubTopicsTotalCountResolver: APITopicResolvers['subTopicsTotalCount'] = async (topic) => {
  const size = await getTopicSubTopicsTotalCount(topic._id);
  return size;
};

export const getTopicLearningMaterialsResolver: APITopicResolvers['learningMaterials'] = async (
  topic,
  { options },
  { user }
) => {
  if (!user && options.filter.completedByUser === true) return { items: [], totalCount: 0 };

  return {
    // TODO: split into separate resolvers
    items: await getTopicLearningMaterials(topic._id, user?._id, nullToUndefined(options)),
    totalCount: await countLearningMaterialsShowedInTopic(
      topic._id,
      user?._id,
      nullToUndefined(pick(options, ['filter', 'query']))
    ),
    availableFilters: {
      tagFilters: await getTopicLearningMaterialsTagsFilters(topic._id, nullToUndefined(options.filter)),
      types: [],
    },
  };
};

export const getTopicLearningMaterialsTotalCountResolver: APITopicResolvers['learningMaterialsTotalCount'] = async (
  topic
) => {
  return await countLearningMaterialsShowedInTopic(topic._id, undefined, { filter: {} });
};

export const getTopicPrerequisitesResolver: APITopicResolvers['prerequisites'] = async (topic) => {
  return (await getTopicPrerequisites({ _id: topic._id })).map(
    ({ followUpTopic, prerequisiteTopic, relationship }) => ({
      prerequisiteTopic,
      followUpTopic,
      ...relationship,
    })
  );
};

export const getTopicFollowUpsResolver: APITopicResolvers['followUps'] = async (topic) => {
  return (await getTopicFollowUps({ _id: topic._id })).map(({ followUpTopic, prerequisiteTopic, relationship }) => ({
    prerequisiteTopic,
    followUpTopic,
    ...relationship,
  }));
};

export const getTopicsCreatedByResolver: APITopicResolvers['createdBy'] = async (topic) => {
  return getTopicCreator({ _id: topic._id });
};

export const getTopicPartOfTopicsResolver: APITopicResolvers['partOfTopics'] = async (topic) => {
  return (await getTopicPartOfTopics({ _id: topic._id })).map(({ subTopic, partOfTopic, relationship }) => ({
    subTopic,
    partOfTopic,
    ...relationship,
  }));
};

export const getTopicDisambiguationTopicResolver: APITopicResolvers['disambiguationTopic'] = async (topic) => {
  const result = await getTopicDisambiguationTopic(topic._id);
  return result?.disambiguationTopic || null;
};

export const getTopicContextualisedTopicsResolver: APITopicResolvers['contextualisedTopics'] = async (topic) => {
  return (await getTopicContextualisedTopics({ _id: topic._id })).map(({ contextualisedTopic }) => contextualisedTopic);
};

export const getTopicContextTopicResolver: APITopicResolvers['contextTopic'] = async (topic) => {
  const result = await getTopicContextTopic(topic._id);
  return result?.contextTopic || null;
};

export const getTopicTopicTypesResolver: APITopicResolvers['topicTypes'] = async (topic) => {
  return getTopicTopicTypes(topic._id);
};
