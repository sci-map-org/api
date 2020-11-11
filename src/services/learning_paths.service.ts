import { generate } from "shortid";
import { generateUrlKey } from "../api/util/urlKey";
import { LearningPath } from "../entities/LearningPath";
import { User } from "../entities/User";
import { NotFoundError } from "../errors/NotFoundError";
import { attachTagsToLearningMaterial, findOrCreateLearningMaterialTag } from "../repositories/learning_material_tags.repository";
import { addResourcesToLearningPath, attachUserStartedLearningPath, createLearningPath, deleteLearningPath, deleteLearningPathResourceItems, findLearningPath, findLearningPathCreatedBy, LearningPathResourceItem, updateLearningPath } from "../repositories/learning_paths.repository";

interface CreateFullLearningPathData {
	name: string;
	key?: string
	description?: string;
	durationMs?: number
	resourceItems: LearningPathResourceItem[];
	tags?: string[]
}

interface UpdateFullLearningPathData {
	name?: string;
	description?: string;
	durationMs?: number | null
	resourceItems?: LearningPathResourceItem[];
}


export const createFullLearningPath = async (userId: string, data: CreateFullLearningPathData): Promise<LearningPath> => {
	const { resourceItems, tags, ...learningPathData } = data

	const createdLearningPath = await createLearningPath(userId, { ...learningPathData, key: learningPathData.key ? generateUrlKey(learningPathData.key) : generateLearningPathUniqueKey(learningPathData.name) });
	if (tags && tags.length) {
		const learningPathTags = await Promise.all(tags.map(t => findOrCreateLearningMaterialTag(t)));
		await attachTagsToLearningMaterial(
			createdLearningPath._id,
			learningPathTags.map(r => r.name)
		);
	}
	if (resourceItems.length) await addResourcesToLearningPath(createdLearningPath._id, resourceItems)
	await attachUserStartedLearningPath(userId, createdLearningPath._id)
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

/**
 * Throws NotFoundError if the user doesn't have access to the learning path (not public and not the owner)
 */
export const findLearningPathIfAuthorized = async (learningPathFilter: { key: string } | { _id: string }, userId?: string): Promise<LearningPath> => {
	const learningPath = await findLearningPath(learningPathFilter)

	if (!learningPath) throw new NotFoundError('LearningPath', JSON.stringify(learningPathFilter))

	if (!learningPath.public) {
		if (!userId || !(await findLearningPathCreatedBy(userId, learningPathFilter))) throw new NotFoundError('LearningPath', JSON.stringify(learningPathFilter))
	}
	return learningPath
}

export const startUserLearningPath = async (userId: string, learningPathId: string): Promise<{ user: User, learningPath: LearningPath }> => {
	await findLearningPathIfAuthorized({ _id: learningPathId }, userId)
	return attachUserStartedLearningPath(userId, learningPathId)
}