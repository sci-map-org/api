export const LearningGoalRequiresLearningGoalLabel = 'REQUIRES';

export interface LearningGoalRequiresLearningGoal {
  strength: number; // 0 to 100.
  // >90 => mandatory
  // <90 & >50 => recommended
  // <50 => optional
}
