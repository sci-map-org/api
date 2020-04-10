import {
  createRelatedNode,
  attachNodes,
  findOne,
  getFilterString,
  getRelatedNodes,
  updateOne,
} from './util/abstract_graph_repo';
import * as shortid from 'shortid';
import { Resource, ResourceType, ResourceMediaType, ResourceLabel } from '../entities/Resource';
import { UserLabel, User } from '../entities/User';
import { DomainLabel, Domain } from '../entities/Domain';
import {
  ResourceBelongsToDomainLabel,
  ResourceBelongsToDomain,
} from '../entities/relationships/ResourceBelongsToDomain';
import { ConceptLabel, Concept } from '../entities/Concept';
import { ResourceCoversConceptLabel, ResourceCoversConcept } from '../entities/relationships/ResourceCoversConcept';
import { neo4jDriver } from '../infra/neo4j';
import { UserConsumedResource, UserConsumedResourceLabel } from '../entities/relationships/UserConsumedResource';
import { prop, map } from 'ramda';
import { UserVotedResourceLabel, UserVotedResource } from '../entities/relationships/UserVotedResource';
import { NotFoundError } from '../errors/NotFoundError';

interface CreateResourceData {
  name: string;
  type: ResourceType;
  mediaType: ResourceMediaType;
  url: string;
  description?: string;
}

interface UpdateResourceData {
  name?: string;
  type?: ResourceType;
  mediaType?: ResourceMediaType;
  url?: string;
  description?: string;
  durationMn?: number | null;
}

export const createResource = (user: { _id: string }, data: CreateResourceData): Promise<Resource> =>
  createRelatedNode({
    originNode: { label: UserLabel, filter: user },
    relationship: { label: 'CREATED', props: { createdAt: Date.now() } },
    newNode: { label: ResourceLabel, props: { ...data, _id: shortid.generate() } },
  });

export const updateResource = updateOne<Resource, { _id: string }, UpdateResourceData>({ label: ResourceLabel });

export const attachResourceToDomain = (resourceId: string, domainId: string) =>
  attachNodes<Resource, ResourceBelongsToDomain, Domain>({
    originNode: { label: ResourceLabel, filter: { _id: resourceId } },
    relationship: { label: ResourceBelongsToDomainLabel },
    destinationNode: { label: DomainLabel, filter: { _id: domainId } },
  });

export const findResource = findOne<Resource, { _id: string }>({ label: ResourceLabel });

export const attachResourceCoversConcepts = async (
  resourceId: string,
  conceptIds: string[],
  props: { userId: string }
): Promise<Resource | null> => {
  const originNode = { label: ResourceLabel, filter: { _id: resourceId } };
  const relationship = { label: ResourceCoversConceptLabel, props };
  const destinationNode = { label: ConceptLabel, filter: {} };

  const session = neo4jDriver.session();

  const { records } = await session.run(
    `MATCH (originNode:${originNode.label} ${getFilterString(
      originNode.filter,
      'originNodeFilter'
    )}) MATCH (destinationNode:${destinationNode.label} ${getFilterString(
      destinationNode.filter,
      'destinationNodeFilter'
    )}) WHERE destinationNode._id IN $conceptIds MERGE (originNode)-[relationship:${
      relationship.label
    }]->(destinationNode) ON CREATE SET relationship = $relationshipProps RETURN properties(relationship) as relationship, properties(originNode) as originNode`,
    {
      originNodeFilter: originNode.filter,
      destinationNodeFilter: destinationNode.filter,
      relationshipProps: relationship.props,
      conceptIds,
    }
  );

  session.close();

  const record = records.pop();

  if (!record) throw new Error();

  return record.get('originNode');
};

export const detachResourceCoversConcepts = async (
  resourceId: string,
  conceptIds: string[]
): Promise<Resource | null> => {
  const originNode = { label: ResourceLabel, filter: { _id: resourceId } };
  const relationship = { label: ResourceCoversConceptLabel, props: {} };
  const destinationNode = { label: ConceptLabel, filter: {} };

  const session = neo4jDriver.session();

  const { records } = await session.run(
    `MATCH (originNode:${originNode.label} ${getFilterString(
      originNode.filter,
      'originNodeFilter'
    )}) MATCH (destinationNode:${destinationNode.label} ${getFilterString(
      destinationNode.filter,
      'destinationNodeFilter'
    )}) WHERE destinationNode._id IN $conceptIds MATCH (originNode)-[relationship:${
      relationship.label
    }]->(destinationNode) DELETE relationship RETURN properties(originNode) as originNode`,
    {
      originNodeFilter: originNode.filter,
      destinationNodeFilter: destinationNode.filter,
      conceptIds,
    }
  );

  session.close();

  const record = records.pop();

  if (!record) throw new Error();

  return record.get('originNode');
};

export const getResourceCoveredConcepts = (_id: string): Promise<Concept[]> =>
  getRelatedNodes<Resource, ResourceCoversConcept, Concept>({
    originNode: {
      label: ResourceLabel,
      filter: { _id },
    },
    relationship: {
      label: ResourceCoversConceptLabel,
    },
    destinationNode: {
      label: ConceptLabel,
    },
  })
    .then(prop('items'))
    .then(map(prop('destinationNode')));

export const getResourceDomains = (_id: string) =>
  getRelatedNodes<Resource, ResourceBelongsToDomain, Domain>({
    originNode: {
      label: ResourceLabel,
      filter: { _id },
    },
    relationship: {
      label: ResourceBelongsToDomainLabel,
    },
    destinationNode: {
      label: DomainLabel,
    },
  })
    .then(prop('items'))
    .then(map(prop('destinationNode')));

export const getUserConsumedResource = async (
  userId: string,
  resourceId: string
): Promise<UserConsumedResource | null> => {
  const { items } = await getRelatedNodes<User, UserConsumedResource, Resource>({
    originNode: {
      label: UserLabel,
      filter: { _id: userId },
    },
    relationship: {
      label: UserConsumedResourceLabel,
    },
    destinationNode: {
      label: ResourceLabel,
      filter: { _id: resourceId },
    },
  });
  const [result] = items;
  if (!result) return null;
  return result.relationship;
};

export const voteResource = async (userId: string, resourceId: string, value: number): Promise<Resource> =>
  attachNodes<User, UserVotedResource, Resource>({
    originNode: {
      label: UserLabel,
      filter: { _id: userId },
    },
    relationship: {
      label: UserVotedResourceLabel,
      onCreateProps: {
        value,
      },
      onMergeProps: {
        value,
      },
    },
    destinationNode: {
      label: ResourceLabel,
      filter: {
        _id: resourceId,
      },
    },
  }).then(([first, ...rest]) => {
    if (!first) throw new Error(`${ResourceLabel} with id ${resourceId} or ${UserLabel} with id ${userId} not found`);
    if (rest.length > 1)
      throw new Error(`More than 1 pair ${ResourceLabel} with id ${resourceId} or ${UserLabel} with id ${userId}`);
    const { destinationNode } = first;
    return destinationNode;
  });

export const getResourceUpvoteCount = async (resourceId: string): Promise<number> => {
  const session = neo4jDriver.session();

  const { records } = await session.run(
    `MATCH (resource:${ResourceLabel})<-[v:${UserVotedResourceLabel}]-(:User) WHERE resource._id = $resourceId 
    WITH sum(v.value) AS upvoteCount RETURN upvoteCount`,
    {
      resourceId,
    }
  );

  session.close();

  const record = records.pop();

  if (!record) throw new Error();

  return record.get('upvoteCount');
};
