import { node, Query, relation } from "cypher-query-builder";
import { generate } from "shortid";
import { LearningPath, LearningPathLabel } from "../entities/LearningPath";
import { LearningPathStartsWithResourceLabel } from "../entities/relationships/LearningPathStartsWithResource";
import { ResourceHasNextInLearningPathResourceLabel } from "../entities/relationships/ResourceHasNextInLearningPathResource";
import { UserCreatedLearningPath, UserCreatedLearningPathLabel } from "../entities/relationships/UserCreatedLearningPath";
import { ResourceLabel } from "../entities/Resource";
import { User, UserLabel } from "../entities/User";
import { neo4jQb } from "../infra/neo4j";
import { createRelatedNode, findOne } from "./util/abstract_graph_repo";

export interface LearningPathResourceItem {
	resourceId: string
	tags?: string[]
	note?: string
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

export const getLearningPathResourceItems = async (learningPathId: string) => {
	const q = new Query(neo4jQb)
	q.match([
	  node('learningPath', LearningPathLabel, { _id: learningPathId }),
	  relation('out', 'i_rel', LearningPathStartsWithResourceLabel),
	  node('i', ResourceLabel),
	]);
	q.optionalMatch([
	  node('i'),
	  relation('out', '', ResourceHasNextInLearningPathResourceLabel, {learningPathId}, [0, 100]),
	  node('', ResourceLabel),
	  relation('out', 'r_rel', ResourceHasNextInLearningPathResourceLabel, {learningPathId}),
	  node('r', ResourceLabel),
	]);

	q.raw(`WITH DISTINCT i_rel { .*, resource: properties(i)} as i_item, collect(r_rel { .*, resource: properties(r)}) as r_item`)

	q.raw(`UNWIND ([i_item] + r_item) as resourceItem RETURN resourceItem`);
	console.log(q.toString())
	const results = await q.run();
	console.log(results)
	const b= results.map(r => r.resourceItem);
	console.log(b)
	return b
}
// export const deleteLearningPath = deleteOne<LearningPath, { _id: string }>({ label: 'LearningPath' });

// export const putLearningPath = updateOne<LearningPath, { _id: string }, UpdateLearningPathData>({ label: 'LearningPath' });



export const addResourcesToLearningPath = async (learningPathId: string, resourceItems: LearningPathResourceItem[]): Promise<LearningPath & {resourceItems: LearningPathResourceItem[]}> => {
	const q = new Query(neo4jQb)
	q.raw(`
	WITH $resourceItems[0] as firstResourceItem, $resourceItems as resourceItems
	MATCH (lp:LearningPath {_id: $learningPathId})
	MATCH (firstResource:Resource {_id: firstResourceItem.resourceId})
	CREATE (lp)-[:STARTS_WITH {learningPathId: $learningPathId, tags: firstResourceItem.tags, note: firstResourceItem.note}]->(firstResource)
	WITH resourceItems, lp, firstResource
	UNWIND resourceItems as item
	match (r:Resource {_id: item.resourceId})
	with collect(r) as resources, resourceItems, lp, firstResource
	FOREACH (i in range(0, size(resources) - 2) |
		FOREACH (node1 in [resources[i]] |
		  FOREACH (node2 in [resources[i+1]] |
			CREATE (node1)-[:${ResourceHasNextInLearningPathResourceLabel} {learningPathId: $learningPathId, tags: resourceItems[i+1].tags, note: resourceItems[i+1].note}]->(node2))))
	return *`, {learningPathId, resourceItems})

	const results = await q.run();
	// return results.map(r => r.i.properties)[0] || null;
	return null as any
}
//   attachUniqueNodes<Resource, ResourceHasNextResource, Resource>({
//     originNode: { label: ResourceLabel, filter: { _id: previousResourceId } },
//     relationship: { label: ResourceHasNextResourceLabel, onCreateProps: { parentResourceId } },
//     destinationNode: { label: ResourceLabel, filter: { _id: subResourceId } },
//   }).then(({ originNode, destinationNode }) => ({
//     previousResource: originNode,
//     subResource: destinationNode,
//   }));