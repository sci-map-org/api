import { UserInputError } from 'apollo-server-koa';
import {
  attachLearningMaterialHasPrerequisiteLearningGoal,
  attachLearningMaterialLeadsToLearningGoal,
  detachLearningMaterialHasPrerequisiteLearningGoal,
  detachLearningMaterialLeadsToLearningGoal,
  getLearningMaterialCoveredTopics,
  getLearningMaterialCreator,
  getLearningMaterialOutcomes,
  getLearningMaterialPrerequisites,
  getLearningMaterialTopicsShowedIn,
  hideLearningMaterialFromTopics,
  rateLearningMaterial,
  showLearningMaterialInTopics,
} from '../../repositories/learning_materials.repository';
import { UnauthenticatedError } from '../errors/UnauthenticatedError';
import { APILearningMaterialResolvers, APIMutationResolvers } from '../schema/types';
import { restrictAccess } from '../util/auth';

export const learningMaterialResolveType: APILearningMaterialResolvers['__resolveType'] = (obj, ctx, info) => {
  if (obj['mediaType']) {
    return 'Resource';
  }
  return 'LearningPath';
};

export const rateLearningMaterialResolver: APIMutationResolvers['rateLearningMaterial'] = async (
  _parent,
  { learningMaterialId, value },
  { user }
) => {
  restrictAccess('loggedInUser', user, 'Must be logged in to rate a learning material'); // TODO maybe restrict to users having completed the resource ?
  if (value < 0 || value > 5) throw new UserInputError('Ratings must be >=0 and <=5');
  return await rateLearningMaterial(user!._id, learningMaterialId, value);
};

export const showLearningMaterialInTopicResolver: APIMutationResolvers['showLearningMaterialInTopic'] = async (
  _parent,
  { topicId, learningMaterialId },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in to show a learning material in a topic');
  const { learningMaterial } = await showLearningMaterialInTopics(learningMaterialId, [topicId]);
  return learningMaterial;
};

export const hideLearningMaterialFromTopicResolver: APIMutationResolvers['hideLearningMaterialFromTopic'] = async (
  _parent,
  { topicId, learningMaterialId },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in to hide a learning material from a topic');
  const { learningMaterial } = await hideLearningMaterialFromTopics(learningMaterialId, [topicId]);
  return learningMaterial;
};

// TODO
// export const addLearningMaterialPrerequisiteResolver: APIMutationResolvers['addLearningMaterialPrerequisite'] = async (
//   _,
//   { learningMaterialId, prerequisiteLearningGoalId },
//   { user }
// ) => {
//   if (!user) throw new UnauthenticatedError('Must be logged in');

//   const { learningMaterial } = await attachLearningMaterialHasPrerequisiteLearningGoal(
//     learningMaterialId,
//     prerequisiteLearningGoalId,
//     {
//       strength: 100,
//       createdBy: user._id,
//     }
//   );
//   return learningMaterial;
// };

// export const removeLearningMaterialPrerequisiteResolver: APIMutationResolvers['removeLearningMaterialPrerequisite'] = async (
//   _,
//   { learningMaterialId, prerequisiteLearningGoalId },
//   { user }
// ) => {
//   if (!user) throw new UnauthenticatedError('Must be logged in');
//   const { learningMaterial } = await detachLearningMaterialHasPrerequisiteLearningGoal(
//     learningMaterialId,
//     prerequisiteLearningGoalId
//   );
//   return learningMaterial;
// };
// export const addLearningMaterialOutcomeResolver: APIMutationResolvers['addLearningMaterialOutcome'] = async (
//   _,
//   { learningMaterialId, outcomeLearningGoalId },
//   { user }
// ) => {
//   if (!user) throw new UnauthenticatedError('Must be logged in');
//   const { learningMaterial } = await attachLearningMaterialLeadsToLearningGoal(
//     learningMaterialId,
//     outcomeLearningGoalId,
//     {
//       strength: 100,
//       createdBy: user._id,
//     }
//   );
//   return learningMaterial;
// };
// export const removeLearningMaterialOutcomeResolver: APIMutationResolvers['removeLearningMaterialOutcome'] = async (
//   _,
//   { learningMaterialId, outcomeLearningGoalId },
//   { user }
// ) => {
//   if (!user) throw new UnauthenticatedError('Must be logged in');
//   const { learningMaterial } = await detachLearningMaterialLeadsToLearningGoal(
//     learningMaterialId,
//     outcomeLearningGoalId
//   );
//   return learningMaterial;
// };

// export const getLearningMaterialPrerequisitesResolver: APILearningMaterialResolvers['prerequisites'] = async learningMaterial => {
//   return (await getLearningMaterialPrerequisites(learningMaterial._id)).map(({ relationship, learningGoal }) => ({
//     learningGoal,
//     ...relationship,
//   }));
// };

// export const getLearningMaterialOutcomesResolver: APILearningMaterialResolvers['outcomes'] = async learningMaterial => {
//   return (await getLearningMaterialOutcomes(learningMaterial._id)).map(({ relationship, learningGoal }) => ({
//     learningGoal,
//     ...relationship,
//   }));
// };


export const getLearningMaterialShowedInResolver: APILearningMaterialResolvers['showedIn'] = async learningMaterial => {
  return await getLearningMaterialTopicsShowedIn(learningMaterial._id);
};

export const getLearningMaterialCoveredSubTopicsResolver: APILearningMaterialResolvers['coveredSubTopics'] = async learningMaterial => {
  return {
    items: (await getLearningMaterialCoveredTopics(learningMaterial._id)).map(({topic}) => topic),
  };
};

export const getLearningMaterialCreatedByResolver: APILearningMaterialResolvers['createdBy'] = async learningMaterial => {
  return getLearningMaterialCreator({ _id: learningMaterial._id });
}
