import { BaseLearningMaterial } from "./LearningMaterial";

export const LearningPathLabel = 'LearningPath'

export interface LearningPath extends BaseLearningMaterial {
	key: string
	name: string;
	public: boolean // defaults to false
	description?: string;
	durationMs?: number
}
