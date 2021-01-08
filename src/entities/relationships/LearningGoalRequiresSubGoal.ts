export const LearningGoalRequiresSubGoalLabel = 'REQUIRES';

export interface LearningGoalRequiresSubGoal {
  strength: number; // 0 to 100.
  // >90 => mandatory
  // <90 & >50 => recommended
  // <50 => optional
}
