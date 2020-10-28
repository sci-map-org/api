import { generate } from "shortid";
import { generateUrlKey } from "../api/util/urlKey";
import { LearningPath } from "../entities/LearningPath";
import { NotFoundError } from "../errors/NotFoundError";
import { addResourcesToLearningPath, createLearningPath, CreateLearningPathData, deleteLearningPath, deleteLearningPathResourceItems, LearningPathResourceItem, updateLearningPath } from "../repositories/learning_paths.repository";

interface CreateFullLearningPathData {
	name: string;
	key?: string
	description?: string;
	resourceItems: LearningPathResourceItem[];
}

interface UpdateFullLearningPathData {
	name?: string;
	description?: string;
	resourceItems?: LearningPathResourceItem[];
}


export const createFullLearningPath = async (userId: string, data: CreateFullLearningPathData): Promise<LearningPath> => {
	const { resourceItems, ...learningPathData } = data

	const createdLearningPath = await createLearningPath(userId, { ...learningPathData, key: learningPathData.key ? generateUrlKey(learningPathData.key) : generateLearningPathUniqueKey(learningPathData.name) });

	if (resourceItems.length) await addResourcesToLearningPath(createdLearningPath._id, resourceItems)

	return createdLearningPath
}

export const updateFullLearningPath = async (learningPathId: string, data: UpdateFullLearningPathData): Promise<LearningPath> => {
	const { resourceItems, ...learningPathData } = data
	const updatedLearningPath = await updateLearningPath({ _id: learningPathId }, learningPathData);
	if (!updatedLearningPath) throw new NotFoundError('LearningPath', learningPathId)

	if (resourceItems) {
		await deleteLearningPathResourceItems(learningPathId)
		if (resourceItems.length) await addResourcesToLearningPath(updatedLearningPath._id, resourceItems)
	}
	return updatedLearningPath
}

export const deleteFullLearningPath = async (learningPathId: string): Promise<void> => {
	await deleteLearningPathResourceItems(learningPathId)
	await deleteLearningPath({ _id: learningPathId })
}

function generateLearningPathUniqueKey(name: string): string {
	return generate() + '_' + generateUrlKey(name)
}