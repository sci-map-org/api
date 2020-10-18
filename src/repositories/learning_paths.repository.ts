import { omit } from "lodash";
import { generate } from "shortid";
import { LearningPath, LearningPathLabel } from "../entities/LearningPath";
import { UserCreatedLearningPath, UserCreatedLearningPathLabel } from "../entities/relationships/UserCreatedLearningPath";
import { User, UserLabel } from "../entities/User";
import { createRelatedNode, deleteOne, findOne, updateOne } from "./util/abstract_graph_repo";

interface LearningPathResourceItem {
	resourceId: string
	tags?: string[]
	description?: string
}

interface UpdateLearningPathData {
	name: string;
	description: string;
	resourceItems: LearningPathResourceItem[];
}

export const createLearningPath = (userId: string, data: UpdateLearningPathData): Promise<LearningPath> => createRelatedNode<User, UserCreatedLearningPath, LearningPath>({
	originNode: {
		label: UserLabel,
		filter: {_id: userId}
	},
	relationship: {
		label: UserCreatedLearningPathLabel,
		props: {createdAt: Date.now()}
	},
	newNode: {
		label: LearningPathLabel,
		props: {...omit(data, 'resourceItems'), _id: generate()}
	}
});

export const deleteLearningPath = deleteOne<LearningPath, { _id: string }>({ label: 'LearningPath' });

export const putLearningPath = updateOne<LearningPath, { _id: string }, UpdateLearningPathData>({ label: 'LearningPath' });

export const findLearningPath = findOne<LearningPath, { _id: string }>({ label: 'LearningPath' });

// export const addResourceToLearningPath = (learningPathId: string, previousResourceId: string, subResourceId: string) =>
//   attachUniqueNodes<Resource, ResourceHasNextResource, Resource>({
//     originNode: { label: ResourceLabel, filter: { _id: previousResourceId } },
//     relationship: { label: ResourceHasNextResourceLabel, onCreateProps: { parentResourceId } },
//     destinationNode: { label: ResourceLabel, filter: { _id: subResourceId } },
//   }).then(({ originNode, destinationNode }) => ({
//     previousResource: originNode,
//     subResource: destinationNode,
//   }));