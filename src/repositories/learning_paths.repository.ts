import { node, Query, relation } from "cypher-query-builder";
import { map, prop } from "ramda";
import { generate } from "shortid";
import { LearningMaterialLabel } from "../entities/LearningMaterial";
import { LearningPath, LearningPathLabel } from "../entities/LearningPath";
import { LearningPathStartsWithResourceLabel } from "../entities/relationships/LearningPathStartsWithResource";
import { ResourceBelongsToLearningPath, ResourceBelongsToLearningPathLabel } from "../entities/relationships/ResourceBelongsToLearningPath";
import { ResourceHasNextInLearningPathResourceLabel } from "../entities/relationships/ResourceHasNextInLearningPathResource";
import { UserCreatedLearningPath, UserCreatedLearningPathLabel } from "../entities/relationships/UserCreatedLearningPath";
import { UserStartedLearningPath, UserStartedLearningPathLabel } from "../entities/relationships/UserStartedLearningPath";
import { Resource, ResourceLabel } from "../entities/Resource";
import { User, UserLabel } from "../entities/User";
import { NotFoundError } from "../errors/NotFoundError";
import { neo4jQb } from "../infra/neo4j";
import { attachUniqueNodes, countRelatedNodes, createRelatedNode, deleteOne, detachUniqueNodes, findOne, getOptionalRelatedNode, getRelatedNode, getRelatedNodes, updateOne } from "./util/abstract_graph_repo";
import { PaginationOptions } from "./util/pagination";

export interface LearningPathResourceItem {
	resourceId: string
	description?: string
}

export interface CreateLearningPathData {
	name: string;
	key: string
	description?: string;
	public?: boolean
	durationMs?: number
}

export interface UpdateLearningPathData {
	name?: string;
	key?: string
	description?: string;
	public?: boolean
	durationMs?: number | null
}

export const createLearningPath = (userId: string, data: CreateLearningPathData): Promise<LearningPath> => createRelatedNode<User, UserCreatedLearningPath, LearningPath>({
	originNode: {
		label: UserLabel,
		filter: { _id: userId }
	},
	relationship: {
		label: UserCreatedLearningPathLabel,
		props: { createdAt: Date.now() }
	},
	newNode: {
		labels: [LearningPathLabel, LearningMaterialLabel],
		props: { public: false, ...data, _id: generate(), createdAt: Date.now() }
	}
});

export const findLearningPath = findOne<LearningPath, { _id: string } | { key: string }>({ label: LearningMaterialLabel })

export const findLearningPathCreatedBy = (userId: string, learningPathFilter: { _id: string } | { key: string }): Promise<LearningPath | null> =>
	getOptionalRelatedNode<User, UserCreatedLearningPath, LearningPath>({
		originNode: { label: UserLabel, filter: { _id: userId } },
		relationship: { label: UserCreatedLearningPathLabel, direction: 'OUT' },
		destinationNode: { label: LearningPathLabel, filter: learningPathFilter }
	}).then(result => result ? result.destinationNode : null);

export const getLearningPathResourceItems = async (learningPathId: string) => {
	const q = new Query(neo4jQb)
	q.match([
		node('learningPath', LearningPathLabel, { _id: learningPathId }),
		relation('out', 'i_rel', LearningPathStartsWithResourceLabel),
		node('i', ResourceLabel),
	]);
	q.optionalMatch([
		node('i'),
		relation('out', '', ResourceHasNextInLearningPathResourceLabel, { learningPathId }, [0, 100]),
		node('', ResourceLabel),
		relation('out', 'r_rel', ResourceHasNextInLearningPathResourceLabel, { learningPathId }),
		node('r', ResourceLabel),
	]);

	q.raw(`WITH DISTINCT i_rel { .*, resource: properties(i)} as i_item, collect(r_rel { .*, resource: properties(r)}) as r_item`)

	q.raw(`UNWIND ([i_item] + r_item) as resourceItem RETURN resourceItem`);
	const results = await q.run();
	const b = results.map(r => r.resourceItem);
	return b
}
export const deleteLearningPath = deleteOne<LearningPath, { _id: string }>({ label: 'LearningPath' });

export const updateLearningPath = updateOne<LearningPath, { _id: string }, UpdateLearningPathData>({ label: LearningPathLabel });



export const addResourcesToLearningPath = async (learningPathId: string, resourceItems: LearningPathResourceItem[]): Promise<void> => {
	const q = new Query(neo4jQb)
	q.raw(`
	WITH $resourceItems[0] as firstResourceItem, $resourceItems as resourceItems
	MATCH (lp:LearningPath {_id: $learningPathId})
	MATCH (firstResource:Resource {_id: firstResourceItem.resourceId})
	CREATE (lp)-[:STARTS_WITH {learningPathId: $learningPathId, description: firstResourceItem.description}]->(firstResource)
	WITH resourceItems, lp, firstResource
	UNWIND resourceItems as item
	match (r:Resource {_id: item.resourceId})
	with collect(r) as resources, resourceItems, lp, firstResource
	FOREACH (i in range(0, size(resources) - 2) |
		FOREACH (node1 in [resources[i]] |
		  FOREACH (node2 in [resources[i+1]] |
			CREATE (node1)-[:${ResourceHasNextInLearningPathResourceLabel} {learningPathId: $learningPathId, description: resourceItems[i+1].description}]->(node2))))
	return *`, { learningPathId, resourceItems })

	await q.run();
}

export const deleteLearningPathResourceItems = async (learningPathId: string): Promise<LearningPath | null> => {
	const q = new Query(neo4jQb)
	q.matchNode('learningPath', LearningPathLabel, { _id: learningPathId })
	q.optionalMatch([
		node('learningPath', LearningPathLabel, { _id: learningPathId }),
		relation('out', 'rels', [LearningPathStartsWithResourceLabel, ResourceHasNextInLearningPathResourceLabel], { learningPathId }, [1, 100]),
		node('r', ResourceLabel),
	]);
	q.raw(`WHERE NOT (r)-[:${LearningPathStartsWithResourceLabel}|${ResourceHasNextInLearningPathResourceLabel} {learningPathId: $learningPathId}]->(:Resource)`, { learningPathId })
	q.with(['learningPath', 'rels'])

	q.raw(`FOREACH (rel in rels |
	  DELETE rel
	)`)
	q.return('learningPath')
	const results = await q.run();
	const [learningPath] = results.map(result => result.learningPath.properties)
	if (!learningPath) throw new NotFoundError('Learning Path', learningPathId)
	return learningPath
}

export const attachResourceToLearningPath = async (learningPathId: string, resourceId: string): Promise<{ learningPath: LearningPath, resource: Resource }> =>
	attachUniqueNodes<Resource, ResourceBelongsToLearningPath, LearningPath>({
		originNode: { label: ResourceLabel, filter: { _id: resourceId } },
		relationship: { label: ResourceBelongsToLearningPathLabel },
		destinationNode: { label: LearningPathLabel, filter: { _id: learningPathId } },
	}).then(({ originNode, destinationNode }) => ({ learningPath: destinationNode, resource: originNode }));

export const detachResourceFromLearningPath = async (learningPathId: string, resourceId: string): Promise<{ learningPath: LearningPath, resource: Resource }> => detachUniqueNodes<Resource, ResourceBelongsToLearningPath, LearningPath>({
	originNode: { label: ResourceLabel, filter: { _id: resourceId } },
	relationship: { label: ResourceBelongsToLearningPathLabel, filter: {} },
	destinationNode: { label: LearningPathLabel, filter: { _id: learningPathId } }
}).then(({ originNode, destinationNode }) => ({ learningPath: destinationNode, resource: originNode }));

export const getLearningPathComplementaryResources = (learningPathId: string): Promise<Resource[]> => getRelatedNodes<LearningPath, ResourceBelongsToLearningPath, Resource>({
	originNode: {
		label: LearningPathLabel,
		filter: { _id: learningPathId },
	},
	relationship: {
		label: ResourceBelongsToLearningPathLabel,
		direction: 'IN',
	},
	destinationNode: {
		label: ResourceLabel,
	},
})
	.then(map(prop('destinationNode')));

export const attachUserStartedLearningPath = (userId: string, learningPathId: string): Promise<{ user: User, relationship: UserStartedLearningPath, learningPath: LearningPath }> =>
	attachUniqueNodes<User, UserStartedLearningPath, LearningPath>({
		originNode: { label: UserLabel, filter: { _id: userId } },
		relationship: { label: UserStartedLearningPathLabel, onCreateProps: { startedAt: Date.now() } },
		destinationNode: { label: LearningPathLabel, filter: { _id: learningPathId } }
	}).then(({ originNode, relationship, destinationNode }) => ({
		user: originNode,
		relationship,
		learningPath: destinationNode
	}))

export const getUserStartedLearningPath = (userId: string, learningPathId: string):
	Promise<UserStartedLearningPath | null> =>
	getOptionalRelatedNode<User, UserStartedLearningPath, LearningPath>({
		originNode: {
			label: UserLabel,
			filter: { _id: userId },
		},
		relationship: {
			label: UserStartedLearningPathLabel,
			direction: 'OUT',
		},
		destinationNode: {
			label: LearningPathLabel,
			filter: { _id: learningPathId },
		}
	}).then((result) => result ? result.relationship : null)

export const getLearningPathCreator = (learningPathId: string): Promise<User> => getRelatedNode<User>({
	originNode: {
		label: LearningPathLabel,
		filter: { _id: learningPathId },
	},
	relationship: {
		label: UserCreatedLearningPathLabel,
		filter: {},
		direction: 'IN',
	},
	destinationNode: {
		label: UserLabel,
		filter: {}
	}
})

export const getLearningPathStartedBy = (learningPathId: string, { pagination }: { pagination?: PaginationOptions }): Promise<{ user: User, relationship: UserStartedLearningPath }[]> =>
	getRelatedNodes<LearningPath, UserStartedLearningPath, User>({
		originNode: {
			label: LearningPathLabel,
			filter: { _id: learningPathId },
		},
		relationship: {
			label: UserStartedLearningPathLabel,
			direction: 'IN',
		},
		destinationNode: {
			label: UserLabel,
		},
		pagination,
	}).then((items) => items.map(({ relationship, destinationNode }) => ({
		relationship,
		user: destinationNode
	})))

export const countLearningPathStartedBy = (learningPathId: string): Promise<number> =>
	countRelatedNodes<LearningPath, UserStartedLearningPath, User>({
		originNode: {
			label: LearningPathLabel,
			filter: { _id: learningPathId },
		},
		relationship: {
			label: UserStartedLearningPathLabel,
			direction: 'IN',
		},
		destinationNode: {
			label: UserLabel,
		},
	})
