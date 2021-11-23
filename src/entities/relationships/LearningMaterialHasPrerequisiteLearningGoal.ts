export const LearningMaterialHasPrerequisiteLearningGoalLabel = 'HAS_PREREQUISITE';

export interface LearningMaterialHasPrerequisiteLearningGoal {
  strength: number; // 0 to 100
  createdByUserId: string;
  createdAt: number;
}
