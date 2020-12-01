export const LearningGoalLabel = 'LearningGoal';

export interface LearningGoal {
  _id: string;
  key: string;
  name: string;
  description?: string;
}
