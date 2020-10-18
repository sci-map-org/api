import { Query } from "cypher-query-builder";
import { omit } from "lodash";
import { generate } from "shortid";
import { LearningPath, LearningPathLabel } from "../entities/LearningPath";
import { UserCreatedLearningPath, UserCreatedLearningPathLabel } from "../entities/relationships/UserCreatedLearningPath";
import { User, UserLabel } from "../entities/User";
import { neo4jQb } from "../infra/neo4j";
import { createRelatedNode, deleteOne, findOne, updateOne } from "./util/abstract_graph_repo";

export interface LearningPathResourceItem {
	resourceId: string
	tags?: string[]
	description?: string
}

interface UpdateLearningPathData {
	name: string;
	description: string;
	resourceItems: LearningPathResourceItem[];
}

export interface CreateLearningPathData {
	name: string;
	description?: string;
}

export const createLearningPath = (userId: string, data: CreateLearningPathData): Promise<LearningPath> => createRelatedNode<User, UserCreatedLearningPath, LearningPath>({
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
		props: {...data, _id: generate()}
	}
});

export const findLearningPath = findOne<LearningPath, { _id: string }>({ label: LearningPathLabel });

// export const deleteLearningPath = deleteOne<LearningPath, { _id: string }>({ label: 'LearningPath' });

// export const putLearningPath = updateOne<LearningPath, { _id: string }, UpdateLearningPathData>({ label: 'LearningPath' });



const addResourcesToLearningPath = async (learningPathId: string, resourceItems: LearningPathResourceItem[]): Promise<LearningPath & {resourceItems: LearningPathResourceItem[]}> => {
	const q = new Query(neo4jQb)


	const results = await q.run();
	return results.map(r => r.i.properties)[0] || null;
}
//   attachUniqueNodes<Resource, ResourceHasNextResource, Resource>({
//     originNode: { label: ResourceLabel, filter: { _id: previousResourceId } },
//     relationship: { label: ResourceHasNextResourceLabel, onCreateProps: { parentResourceId } },
//     destinationNode: { label: ResourceLabel, filter: { _id: subResourceId } },
//   }).then(({ originNode, destinationNode }) => ({
//     previousResource: originNode,
//     subResource: destinationNode,
//   }));