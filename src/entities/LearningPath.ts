import {Resource} from "./Resource";

export interface LearningPath {
	_id: string;
	name: string;
	description: string;
	resources: Resource[];
}
