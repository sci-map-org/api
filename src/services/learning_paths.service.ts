import {LearningPath} from "../entities/LearningPath";
import {createLearningPath} from "../repositories/learning_paths.repositories";
import {Resource} from "../entities/Resource";

interface CreateAndSaveLearningPathData {
	name: string;
	description: string;
	resources: Resource[];
}

export const createAndSaveLearningPath = (data: CreateAndSaveLearningPathData, userId: string): Promise<LearningPath> => {
	const createdLearningPath = createLearningPath(data);
}
