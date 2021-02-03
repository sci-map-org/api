import { BaseTopic } from './Topic';

export const LearningGoalLabel = 'LearningGoal';

export interface LearningGoal extends BaseTopic {
  type: LearningGoalType;
  publishedAt?: number;
}

export enum LearningGoalType {
  Roadmap = 'Roadmap',
  SubGoal = 'SubGoal',
}
