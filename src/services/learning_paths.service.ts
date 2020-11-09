import { ForbiddenError } from "apollo-server-koa";
import { generate } from "shortid";
import { generateUrlKey } from "../api/util/urlKey";
import { LearningPath } from "../entities/LearningPath";
import { User } from "../entities/User";
import { NotFoundError } from "../errors/NotFoundError";
import { attachTagsToLearningMaterial, findOrCreateLearningMaterialTag } from "../repositories/learning_material_tags.repository";
import { addResourcesToLearningPath, attachUserStartedLearningPath, createLearningPath, CreateLearningPathData, deleteLearningPath, deleteLearningPathResourceItems, findLearningPath, findLearningPathCreatedBy, LearningPathResourceItem, updateLearningPath } from "../repositories/learning_paths.repository";

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


export const startUserLearningPath = async (userId: string, learningPathId: string): Promise<{ user: User, learningPath: LearningPath }> => {
	const learningPath = await findLearningPath({ _id: learningPathId })

	if (!learningPath) throw new NotFoundError('LearningPath', learningPathId)

	if (!learningPath.public) {
		if (!(await findLearningPathCreatedBy(userId, { _id: learningPathId }))) throw new ForbiddenError(`Learning path ${learningPathId} is not public, can not start it`)
	}
	return attachUserStartedLearningPath(userId, learningPathId)
}