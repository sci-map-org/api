import { LearningPath } from "../entities/LearningPath";
import { addResourcesToLearningPath, createLearningPath, CreateLearningPathData, LearningPathResourceItem } from "../repositories/learning_paths.repository";

interface CreateFullLearningPathData extends CreateLearningPathData {
	resourceItems?: LearningPathResourceItem[];
}

export const createFullLearningPath = async (userId: string, data: CreateFullLearningPathData): Promise<LearningPath> => {
	const {resourceItems, ...learningPathData} = data
	const createdLearningPath = await createLearningPath(userId, learningPathData);

	if(resourceItems) await addResourcesToLearningPath(createdLearningPath._id, resourceItems)

	return createdLearningPath
}
