import { LearningGoal } from '../entities/LearningGoal';
import { NotFoundError } from '../errors/NotFoundError';
import { findLearningGoal, findLearningGoalCreatedBy } from '../repositories/learning_goals.repository';

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
