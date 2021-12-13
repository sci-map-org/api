import { UserInputError } from 'apollo-server-errors';
import { TopicLabel } from '../../entities/Topic';
import { NotFoundError } from '../../errors/NotFoundError';
import {
  attachTopicHasContextTopic,
  attachTopicHasDisambiguationTopic,
  attachTopicIsSubTopicOfTopic,
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
} from '../../repositories/topics.repository';
import { initSubtopicIndexValue } from '../../services/topics.service';
import {
  APIMutationResolvers,
  APIQueryResolvers,
  APITopicLearningMaterialsSortingType,
  APITopicResolvers,
} from '../schema/types';
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

export const getTopicValidContextsFromDisambiguationResolver: APIQueryResolvers['getTopicValidContextsFromDisambiguation'] = async (
  _,
  { parentTopicId, disambiguationTopicId }
) => {
  return getTopicsValidContextsFromDisambiguation(parentTopicId, disambiguationTopicId);
};

export const checkTopicKeyAvailabilityResolver: APIQueryResolvers['checkTopicKeyAvailability'] = async (_, { key }) => {
  let existingTopic = await getTopicByKey(key);
  return {
    available: !existingTopic,
    existingTopic,
  };
};

export const createTopicResolver: APIMutationResolvers['createTopic'] = async (_parent, { payload }, { user }) => {
  restrictAccess('loggedInUser', user, 'Must be logged in to create a topic');
  return await createTopic({ _id: user!._id }, nullToUndefined(payload));
};

export const addSubTopicResolver: APIMutationResolvers['addSubTopic'] = async (
  _parent,
  { parentTopicId, payload, contextOptions },
  { user }
) => {
  restrictAccess('loggedInUser', user, 'Must be logged in to create a topic');
  const createdTopic = await createTopic({ _id: user!._id }, nullToUndefined(payload));
  await attachTopicIsSubTopicOfTopic(parentTopicId, createdTopic._id, {
    index: await initSubtopicIndexValue(parentTopicId),
    createdByUserId: user?._id,
  });
  if (contextOptions) {
    await attachTopicHasDisambiguationTopic(createdTopic._id, contextOptions.disambiguationTopicId, {
      createdByUserId: user!._id,
    });
    await attachTopicHasContextTopic(createdTopic._id, contextOptions.contextTopicId, { createdByUserId: user!._id });
  }
  return createdTopic;
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

  await updateTopic({ _id: existingTopicId }, { key: existingTopic.key + '_(_' + existingTopicContext.key + '_)' });
  const disambiguationTopic = await createTopic(
    { _id: user!._id },
    {
      name: existingTopic.name,
      key: existingTopic.key,
      isDisambiguation: true,
    }
  );
  await attachTopicHasDisambiguationTopic(existingTopic._id, disambiguationTopic._id, {
    createdByUserId: user!._id,
  });
  await attachTopicHasContextTopic(existingTopic._id, existingTopicContextTopicId, { createdByUserId: user!._id });
  return disambiguationTopic;
};

export const updateTopicResolver: APIMutationResolvers['updateTopic'] = async (
  _parent,
  { topicId, payload },
  { user }
) => {
  restrictAccess('loggedInUser', user, 'Must be logged in to update a topic');
  const updatedTopic = await updateTopic({ _id: topicId }, nullToUndefined(payload));
  if (!updatedTopic) throw new NotFoundError('Topic', topicId);
  return updatedTopic;
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
  if (!validContexts.find(validContext => validContext._id === newContextTopic._id))
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

export const getTopicParentTopicResolver: APITopicResolvers['parentTopic'] = async topic => {
  const parent = await getTopicParentTopic(topic._id);
  return parent?.parentTopic || null;
};

export const getTopicSubTopicsResolver: APITopicResolvers['subTopics'] = async topic => {
  const result = await getTopicSubTopics(topic._id);
  return result.map(({ parentTopic, subTopic, relationship, relationshipType }) => ({
    subTopic,
    ...relationship,
    relationshipType,
    parentTopic,
  }));
};

export const getTopicSubTopicsTotalCountResolver: APITopicResolvers['subTopicsTotalCount'] = async topic => {
  const size = await getTopicSubTopicsTotalCount(topic._id);
  return size;
};

export const getTopicLearningMaterialsResolver: APITopicResolvers['learningMaterials'] = async (
  topic,
  { options },
  { user }
) => {
  if (!user && options.filter.completedByUser === true) return { items: [] };
  if (
    options.sortingType === APITopicLearningMaterialsSortingType.Recommended &&
    options.filter.completedByUser === undefined
  )
    throw new UserInputError(
      'getTopicLearningMaterials : when using recommendations, completedByUser Filter must be set'
    );
  return {
    items: await getTopicLearningMaterials(topic._id, user?._id, nullToUndefined(options)),
  };
};

export const getTopicLearningMaterialsTotalCountResolver: APITopicResolvers['learningMaterialsTotalCount'] = async topic => {
  return await countLearningMaterialsShowedInTopic(topic._id);
};

export const getTopicPrerequisitesResolver: APITopicResolvers['prerequisites'] = async topic => {
  return (await getTopicPrerequisites({ _id: topic._id })).map(
    ({ followUpTopic, prerequisiteTopic, relationship }) => ({
      prerequisiteTopic,
      followUpTopic,
      ...relationship,
    })
  );
};

export const getTopicFollowUpsResolver: APITopicResolvers['followUps'] = async topic => {
  return (await getTopicFollowUps({ _id: topic._id })).map(({ followUpTopic, prerequisiteTopic, relationship }) => ({
    prerequisiteTopic,
    followUpTopic,
    ...relationship,
  }));
};

export const getTopicsCreatedByResolver: APITopicResolvers['createdBy'] = async topic => {
  return getTopicCreator({ _id: topic._id });
};

export const getTopicPartOfTopicsResolver: APITopicResolvers['partOfTopics'] = async topic => {
  return (await getTopicPartOfTopics({ _id: topic._id })).map(({ subTopic, partOfTopic, relationship }) => ({
    subTopic,
    partOfTopic,
    ...relationship,
  }));
};

export const getTopicDisambiguationTopicResolver: APITopicResolvers['disambiguationTopic'] = async topic => {
  const result = await getTopicDisambiguationTopic(topic._id);
  return result?.disambiguationTopic || null;
};

export const getTopicContextualisedTopicsResolver: APITopicResolvers['contextualisedTopics'] = async topic => {
  return (await getTopicContextualisedTopics({ _id: topic._id })).map(({ contextualisedTopic }) => contextualisedTopic);
};

export const getTopicContextTopicResolver: APITopicResolvers['contextTopic'] = async topic => {
  const result = await getTopicContextTopic(topic._id);
  return result?.contextTopic || null;
};
