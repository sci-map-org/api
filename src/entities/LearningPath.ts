import { BaseLearningMaterial } from "./LearningMaterial";

export const LearningPathLabel = 'LearningPath'

export interface LearningPath extends BaseLearningMaterial {
	key: string
	name: string;
	description?: string;
	durationMs?: number
}
