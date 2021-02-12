import { LearningGoal } from '../entities/LearningGoal';
import { User } from '../entities/User';
import { NotFoundError } from '../errors/NotFoundError';
import {
  attachUserStartedLearningGoal,
  findLearningGoal,
  findLearningGoalCreatedBy,
} from '../repositories/learning_goals.repository';

/**
 * Throws NotFoundError if the user doesn't have access to the learning goal (not public and not the owner)
 */
export const findLearningGoalIfAuthorized = async (
  learningGoalFilter: { key: string } | { _id: string },
  userId?: string
): Promise<LearningGoal> => {
  const learningGoal = await findLearningGoal(learningGoalFilter);

  if (!learningGoal) throw new NotFoundError('LearningGoal', JSON.stringify(learningGoalFilter));

  if (!learningGoal.publishedAt) {
    if (!userId || !(await findLearningGoalCreatedBy(userId, learningGoalFilter)))
      throw new NotFoundError('LearningGoal', JSON.stringify(learningGoalFilter));
  }
  return learningGoal;
};

export const startLearningGoal = async (
  userId: string,
  learningGoalId: string
): Promise<{ user: User; learningGoal: LearningGoal }> => {
  await findLearningGoalIfAuthorized({ _id: learningGoalId }, userId);
  const { user, learningGoal } = await attachUserStartedLearningGoal(userId, learningGoalId, { startedAt: Date.now() });
  return { user, learningGoal };
};
