import { LearningMaterialHasPrerequisiteLearningGoal, LearningMaterialHasPrerequisiteLearningGoalLabel } from "./LearningMaterialHasPrerequisiteLearningGoal";

/**
 * Same as LearningMaterialHasPrerequisiteLearningGoal basically since a prereq can be
 * a topic or a learning goal. Can be solved by creating an entity in between
 */
export const LearningMaterialHasPrerequisiteTopicLabel = LearningMaterialHasPrerequisiteLearningGoalLabel;

export interface LearningMaterialHasPrerequisiteTopic extends LearningMaterialHasPrerequisiteLearningGoal {
}
