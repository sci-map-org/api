import {findOne, updateOne, deleteOne, createNode} from "./util/abstract_graph_repo"
import {LearningPath} from "../entities/LearningPath"
import {Resource} from "../entities/Resource";

interface UpdateLearningPathData {
	name: string;
	description: string;
	resources: Resource[];
}

export const createLearningPath = createNode<LearningPath>({ label: 'LearningPath' });

export const deleteLearningPath = deleteOne<LearningPath, { _id: string }>({ label: 'LearningPath' });

export const putLearningPath = updateOne<LearningPath, { _id: string }, UpdateLearningPathData>({ label: 'LearningPath' });

export const findLearningPath = findOne<LearningPath, { _id: string }>({ label: 'LearningPath' });

