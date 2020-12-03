import { UserInputError } from 'apollo-server-koa';
import { NotFoundError } from '../../errors/NotFoundError';
import {
  attachLearningGoalToDomain,
  createLearningGoal,
  deleteLearningGoal,
  detachLearningGoalFromDomain,
  findLearningGoal,
  findLearningGoalCreatedBy,
  getLearningGoalDomains,
  updateLearningGoal,
} from '../../repositories/learning_goals.repository';
import { UnauthenticatedError } from '../errors/UnauthenticatedError';
import { APILearningGoalResolvers, APIMutationResolvers, APIQueryResolvers, UserRole } from '../schema/types';
import { restrictAccess } from '../util/auth';
import { nullToUndefined } from '../util/nullToUndefined';

export const createLearningGoalResolver: APIMutationResolvers['createLearningGoal'] = async (
  _parent,
  { payload },
  { user }
) => {
  restrictAccess('loggedInUser', user, 'Must be logged in to create a learning goal');
  if (user!.role === UserRole.USER && !!payload.key)
    throw new UserInputError('can not set the key if not an admin or contributor');
  return await createLearningGoal({ _id: user!._id }, nullToUndefined(payload));
};

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
  { domainId, payload },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in to add a learning goal');
  const createdLearningGoal = await createLearningGoal({ _id: user._id }, nullToUndefined(payload));
  return await attachLearningGoalToDomain(createdLearningGoal._id, domainId);
};
export const attachLearningGoalToDomainResolver: APIMutationResolvers['attachLearningGoalToDomain'] = async (
  _,
  { domainId, learningGoalId },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in to attach a learning goal to a domain');
  return await attachLearningGoalToDomain(learningGoalId, domainId);
};
export const detachLearningGoalFromDomainResolver: APIMutationResolvers['detachLearningGoalFromDomain'] = async (
  _,
  { domainId, learningGoalId },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in to detach a learning goal from a domain');
  return await detachLearningGoalFromDomain(learningGoalId, domainId);
};

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

export const getLearningGoalDomainsResolver: APILearningGoalResolvers['domains'] = async learningGoal => {
  const domains = await getLearningGoalDomains(learningGoal._id);
  return domains.map(domain => ({ domain }));
};
