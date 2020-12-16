import { UserInputError } from 'apollo-server-koa';
import {
  attachLearningMaterialCoversConcepts,
  attachLearningMaterialHasPrerequisiteLearningGoal,
  attachLearningMaterialLeadsToLearningGoal,
  attachLearningMaterialToDomain,
  detachLearningMaterialCoversConcepts,
  detachLearningMaterialFromDomain,
  detachLearningMaterialHasPrerequisiteLearningGoal,
  detachLearningMaterialLeadsToLearningGoal,
  getLearningMaterialOutcomes,
  getLearningMaterialPrerequisites,
  rateLearningMaterial,
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
  restrictAccess(
    'contributorOrAdmin',
    user,
    'Must be logged in and an admin or a contributor to rate a learning material'
  );
  if (value < 0 || value > 5) throw new UserInputError('Ratings must be >=0 and <=5');
  return await rateLearningMaterial(user!._id, learningMaterialId, value);
};

export const attachLearningMaterialToDomainResolver: APIMutationResolvers['attachLearningMaterialToDomain'] = async (
  _parent,
  { domainId, learningMaterialId },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in');
  const { learningMaterial } = await attachLearningMaterialToDomain(learningMaterialId, domainId);
  return learningMaterial;
};

export const detachLearningMaterialFromDomainResolver: APIMutationResolvers['detachLearningMaterialFromDomain'] = async (
  _parent,
  { domainId, learningMaterialId },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in to detach a learning material from a domain');
  const { learningMaterial } = await detachLearningMaterialFromDomain(learningMaterialId, domainId);
  return learningMaterial;
};

export const attachLearningMaterialCoversConceptsResolver: APIMutationResolvers['attachLearningMaterialCoversConcepts'] = async (
  _parent,
  { learningMaterialId, conceptIds },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in to add covered concepts to a learning material');
  const { learningMaterial } = await attachLearningMaterialCoversConcepts(learningMaterialId, conceptIds, {
    userId: user._id,
  });
  return learningMaterial;
};

export const detachLearningMaterialCoversConceptsResolver: APIMutationResolvers['detachLearningMaterialCoversConcepts'] = async (
  _parent,
  { learningMaterialId, conceptIds },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in to remove covered concepts to a learning material');
  const { learningMaterial } = await detachLearningMaterialCoversConcepts(learningMaterialId, conceptIds);
  return learningMaterial;
};

export const addLearningMaterialPrerequisiteResolver: APIMutationResolvers['addLearningMaterialPrerequisite'] = async (
  _,
  { learningMaterialId, prerequisiteLearningGoalId },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in');

  const { learningMaterial } = await attachLearningMaterialHasPrerequisiteLearningGoal(
    learningMaterialId,
    prerequisiteLearningGoalId,
    {
      strength: 100,
      createdBy: user._id,
    }
  );
  return learningMaterial;
};

export const removeLearningMaterialPrerequisiteResolver: APIMutationResolvers['removeLearningMaterialPrerequisite'] = async (
  _,
  { learningMaterialId, prerequisiteLearningGoalId },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in');
  const { learningMaterial } = await detachLearningMaterialHasPrerequisiteLearningGoal(
    learningMaterialId,
    prerequisiteLearningGoalId
  );
  return learningMaterial;
};
export const addLearningMaterialOutcomeResolver: APIMutationResolvers['addLearningMaterialOutcome'] = async (
  _,
  { learningMaterialId, outcomeLearningGoalId },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in');
  const { learningMaterial } = await attachLearningMaterialLeadsToLearningGoal(
    learningMaterialId,
    outcomeLearningGoalId,
    {
      strength: 100,
      createdBy: user._id,
    }
  );
  return learningMaterial;
};
export const removeLearningMaterialOutcomeResolver: APIMutationResolvers['removeLearningMaterialOutcome'] = async (
  _,
  { learningMaterialId, outcomeLearningGoalId },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in');
  const { learningMaterial } = await detachLearningMaterialLeadsToLearningGoal(
    learningMaterialId,
    outcomeLearningGoalId
  );
  return learningMaterial;
};

export const getLearningMaterialPrerequisitesResolver: APILearningMaterialResolvers['prerequisites'] = async learningMaterial => {
  return (await getLearningMaterialPrerequisites(learningMaterial._id)).map(({ relationship, learningGoal }) => ({
    learningGoal,
    ...relationship,
    createdAt: new Date(relationship.createdAt),
  }));
};

export const getLearningMaterialOutcomesResolver: APILearningMaterialResolvers['outcomes'] = async learningMaterial => {
  return (await getLearningMaterialOutcomes(learningMaterial._id)).map(({ relationship, learningGoal }) => ({
    learningGoal,
    ...relationship,
    createdAt: new Date(relationship.createdAt),
  }));
};
