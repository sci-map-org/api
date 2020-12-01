import { UserInputError } from 'apollo-server-koa';
import { NotFoundError } from '../../errors/NotFoundError';
import {
  createLearningGoal,
  findLearningGoal,
  findLearningGoalCreatedBy,
  updateLearningGoal,
} from '../../repositories/learning_goals.repository';
import { UnauthenticatedError } from '../errors/UnauthenticatedError';
import { APIMutationResolvers, APIQueryResolvers, UserRole } from '../schema/types';
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

export const getLearningGoalByKeyResolver: APIQueryResolvers['getLearningGoalByKey'] = async (_, { key }) => {
  const learningGoal = await findLearningGoal({ key });
  if (!learningGoal) throw new NotFoundError('LearningGoal', key, 'key');
  return learningGoal;
};
