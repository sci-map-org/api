import { node, Query, relation } from "cypher-query-builder";
import { generate } from "shortid";
import { LearningPath, LearningPathLabel } from "../entities/LearningPath";
import { LearningPathStartsWithResourceLabel } from "../entities/relationships/LearningPathStartsWithResource";
import { ResourceHasNextInLearningPathResourceLabel } from "../entities/relationships/ResourceHasNextInLearningPathResource";
import { UserCreatedLearningPath, UserCreatedLearningPathLabel } from "../entities/relationships/UserCreatedLearningPath";
import { ResourceLabel } from "../entities/Resource";
import { User, UserLabel } from "../entities/User";
import { NotFoundError } from "../errors/NotFoundError";
import { neo4jQb } from "../infra/neo4j";
import { createRelatedNode, deleteOne, getOptionalRelatedNode, updateOne } from "./util/abstract_graph_repo";

export interface LearningPathResourceItem {
	resourceId: string
	tags?: string[]
	note?: string
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

export const findLearningPathCreatedBy = (userId: string, learningPathId: string): Promise<LearningPath | null> => 
getOptionalRelatedNode<User,  UserCreatedLearningPath, LearningPath>({
	originNode: {label: UserLabel, filter: {_id: userId}},
	relationship: {label: UserCreatedLearningPathLabel, direction: 'OUT'},
	destinationNode: { label: LearningPathLabel, filter: {_id: learningPathId} }
});

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
	const results = await q.run();
	const b= results.map(r => r.resourceItem);
	return b
}
export const deleteLearningPath = deleteOne<LearningPath, { _id: string }>({ label: 'LearningPath' });

export const updateLearningPath = updateOne<LearningPath, { _id: string }, CreateLearningPathData>({ label: LearningPathLabel });



export const addResourcesToLearningPath = async (learningPathId: string, resourceItems: LearningPathResourceItem[]): Promise<void> => {
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

	await q.run();
}

export const deleteLearningPathResourceItems = async (learningPathId: string): Promise<LearningPath | null> => {
	const q = new Query(neo4jQb)
	q.matchNode('learningPath', LearningPathLabel, { _id: learningPathId })
	q.optionalMatch([
		node('learningPath', LearningPathLabel, { _id: learningPathId }),
		relation('out', 'rels', [LearningPathStartsWithResourceLabel, ResourceHasNextInLearningPathResourceLabel], {learningPathId}, [1, 100]),
		node('r', ResourceLabel),
	  ]);
	q.raw(`WHERE NOT (r)-[:${LearningPathStartsWithResourceLabel}|${ResourceHasNextInLearningPathResourceLabel} {learningPathId: $learningPathId}]->(:Resource)`, {learningPathId})
	q.with(['learningPath', 'rels'])
	
	q.raw(`FOREACH (rel in rels |
	  DELETE rel
	)`)
	q.return('learningPath')
	const results = await q.run();
	const [learningPath] =results.map(result => result.learningPath.properties)
	if(!learningPath) throw new NotFoundError('Learning Path', learningPathId)
	return learningPath
}