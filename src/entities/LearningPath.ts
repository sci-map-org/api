import {Resource} from "./Resource";

export const LearningPathLabel = 'LearningPath'

export interface LearningPath {
	_id: string;
	name: string;
	description?: string;
}
