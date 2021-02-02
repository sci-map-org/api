import { BaseTopic } from './Topic';

export const LearningGoalLabel = 'LearningGoal';

export interface LearningGoal extends BaseTopic {
  publishedAt?: number;
}
