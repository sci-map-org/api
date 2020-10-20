import { LearningPath } from "../entities/LearningPath";
import { NotFoundError } from "../errors/NotFoundError";
import { addResourcesToLearningPath, createLearningPath, CreateLearningPathData, deleteLearningPath, deleteLearningPathResourceItems, LearningPathResourceItem, updateLearningPath } from "../repositories/learning_paths.repository";

interface CreateFullLearningPathData extends CreateLearningPathData {
	resourceItems?: LearningPathResourceItem[];
}

export const createFullLearningPath = async (userId: string, data: CreateFullLearningPathData): Promise<LearningPath> => {
	const {resourceItems, ...learningPathData} = data
	const createdLearningPath = await createLearningPath(userId, learningPathData);

	if(resourceItems) await addResourcesToLearningPath(createdLearningPath._id, resourceItems)

	return createdLearningPath
}

export const updateFullLearningPath = async (learningPathId: string, data: CreateFullLearningPathData): Promise<LearningPath> => {
	const {resourceItems, ...learningPathData} = data
	const updatedLearningPath = await updateLearningPath({_id: learningPathId}, learningPathData);
	if(!updatedLearningPath) throw new NotFoundError('LearningPath', learningPathId)
	
	await deleteLearningPathResourceItems(learningPathId)

	if(resourceItems) await addResourcesToLearningPath(updatedLearningPath._id, resourceItems)
	return updatedLearningPath
}

export const deleteFullLearningPath = async (learningPathId: string): Promise<void> => {
	await deleteLearningPathResourceItems(learningPathId)
	await deleteLearningPath({_id: learningPathId})
}