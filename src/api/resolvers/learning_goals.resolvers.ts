import { UserInputError } from 'apollo-server-koa';
import { NotFoundError } from '../../errors/NotFoundError';
import {
  attachLearningGoalToDomain,
  createLearningGoal,
  deleteLearningGoal,
  detachLearningGoalFromDomain,
  findDomainLearningGoalByKey,
  findLearningGoal,
  findLearningGoalCreatedBy,
  getLearningGoalDomain,
  updateLearningGoal,
} from '../../repositories/learning_goals.repository';
import { UnauthenticatedError } from '../errors/UnauthenticatedError';
import { APILearningGoalResolvers, APIMutationResolvers, APIQueryResolvers, UserRole } from '../schema/types';
import { restrictAccess } from '../util/auth';
import { nullToUndefined } from '../util/nullToUndefined';

// export const createLearningGoalResolver: APIMutationResolvers['createLearningGoal'] = async (
//   _parent,
//   { payload },
//   { user }
// ) => {
//   restrictAccess('loggedInUser', user, 'Must be logged in to create a learning goal');
//   if (user!.role === UserRole.USER && !!payload.key)
//     throw new UserInputError('can not set the key if not an admin or contributor');
//   return await createLearningGoal({ _id: user!._id }, nullToUndefined(payload));
// };

export const updateLearningGoalResolver: APIMutationResolvers['updateLearningGoal'] = async (
  _,
  { _id, payload },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in');
  if (user.role === UserRole.USER && !!payload.key)
    throw new UserInputError('can not set the key if not an admin or contributor');
  const learningPath =
    user.role === UserRole.ADMIN ? await findLearningGoal({ _id }) : await findLearningGoalCreatedBy(user._id, { _id });
  if (!learningPath) throw new NotFoundError('LearningPath', _id);

  const updatedLearningGoal = await updateLearningGoal({ _id }, nullToUndefined(payload));
  if (!updatedLearningGoal) throw new Error('updateLearningGoalResolver: Should never happen');
  return updatedLearningGoal;
};

export const addLearningGoalToDomainResolver: APIMutationResolvers['addLearningGoalToDomain'] = async (
  _,
  { domainId, payload, relationshipPayload },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in to add a learning goal');
  const createdLearningGoal = await createLearningGoal({ _id: user._id }, nullToUndefined(payload));
  return await attachLearningGoalToDomain(createdLearningGoal._id, domainId, {
    contextualKey: relationshipPayload.contextualKey || createdLearningGoal.key,
  }); // TODO check
};
// export const attachLearningGoalToDomainResolver: APIMutationResolvers['attachLearningGoalToDomain'] = async (
//   _,
//   { domainId, learningGoalId, payload },
//   { user }
// ) => {
//   if (!user) throw new UnauthenticatedError('Must be logged in to attach a learning goal to a domain');
//   const learningGoal = await findLearningGoal({ _id: learningGoalId });
//   if (!learningGoal) throw new NotFoundError('LearningGoal', learningGoalId);
//   return await attachLearningGoalToDomain(learningGoalId, domainId, {
//     contextualKey: payload.contextualKey || learningGoal.key,
//   });
// };
// export const detachLearningGoalFromDomainResolver: APIMutationResolvers['detachLearningGoalFromDomain'] = async (
//   _,
//   { domainId, learningGoalId },
//   { user }
// ) => {
//   if (!user) throw new UnauthenticatedError('Must be logged in to detach a learning goal from a domain');
//   return await detachLearningGoalFromDomain(learningGoalId, domainId);
// };

export const deleteLearningGoalResolver: APIMutationResolvers['deleteLearningGoal'] = async (
  _parent,
  { _id },
  { user }
) => {
  restrictAccess('admin', user, 'Must be logged in and an admin to delete a learning goal');
  const { deletedCount } = await deleteLearningGoal({ _id });
  if (!deletedCount) throw new NotFoundError('LearningGoal', _id, 'id');
  return { _id, success: true };
};
export const getLearningGoalByKeyResolver: APIQueryResolvers['getLearningGoalByKey'] = async (_, { key }) => {
  const learningGoal = await findLearningGoal({ key });
  if (!learningGoal) throw new NotFoundError('LearningGoal', key, 'key');
  return learningGoal;
};

export const getDomainLearningGoalByKeyResolver: APIQueryResolvers['getDomainLearningGoalByKey'] = async (
  _parent,
  { domainKey, contextualLearningGoalKey }
) => {
  const result = await findDomainLearningGoalByKey(domainKey, contextualLearningGoalKey);
  if (!result) throw new NotFoundError('LearningGoal', contextualLearningGoalKey, 'contextualLearningGoalKey');
  return result;
};

export const getLearningGoalDomainsResolver: APILearningGoalResolvers['domains'] = async learningGoal => {
  return await getLearningGoalDomain(learningGoal._id);
};
