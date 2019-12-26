import { createRelatedNode, attachNodes, findOne, getFilterString, getRelatedNodes } from './util/abstract_graph_repo';
import * as shortid from 'shortid';
import { Resource, ResourceType, ResourceMediaType, ResourceLabel } from '../entities/Resource';
import { UserLabel } from '../entities/User';
import { DomainLabel } from '../entities/Domain';
import { ResourceBelongsToDomainLabel } from '../entities/relationships/ResourceBelongsToDomain';
import { ConceptLabel, Concept } from '../entities/Concept';
import { ResourceCoversConceptLabel } from '../entities/relationships/ResourceCoversConcept';
import { neo4jDriver } from '../infra/neo4j';

interface CreateResourceData {
  name: string;
  type: ResourceType;
  mediaType: ResourceMediaType;
  url: string;
  description?: string;
}

export const createResource = (user: { _id: string }, data: CreateResourceData): Promise<Resource> =>
  createRelatedNode({
    originNode: { label: UserLabel, filter: user },
    relationship: { label: 'CREATED', props: { createdAt: Date.now() } },
    newNode: { label: ResourceLabel, props: { ...data, _id: shortid.generate() } },
  });

export const attachResourceToDomain = (resourceId: string, domainId: string) =>
  attachNodes({
    originNode: { label: ResourceLabel, filter: { _id: resourceId } },
    relationship: { label: ResourceBelongsToDomainLabel, props: {} },
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

export const getResourceCoveredConcepts = (_id: string) =>
  getRelatedNodes<Concept>({
    originNode: {
      label: ResourceLabel,
      filter: { _id },
    },
    relationship: {
      label: ResourceCoversConceptLabel,
      filter: {},
    },
    destinationNode: {
      label: ConceptLabel,
      filter: {},
    },
  });
