import { LearningPath } from "../entities/LearningPath";
import { createLearningPath, CreateLearningPathData, LearningPathResourceItem } from "../repositories/learning_paths.repository";

interface CreateFullLearningPathData extends CreateLearningPathData {
	resourceItems?: LearningPathResourceItem[];
}

export const createFullLearningPath = async (userId: string, data: CreateFullLearningPathData): Promise<LearningPath> => {
	const createdLearningPath = await createLearningPath(userId, data);

	// TODO add resources
	return createdLearningPath
}
