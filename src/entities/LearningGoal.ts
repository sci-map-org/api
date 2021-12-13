export const LearningGoalLabel = 'LearningGoal';

export interface LearningGoal  {
  _id: string;
  name: string;
  key: string;
  description?: string;
  type: LearningGoalType;
  hidden: boolean;
  publishedAt?: number;
}

export enum LearningGoalType {
  Roadmap = 'Roadmap',
  SubGoal = 'SubGoal',
}
