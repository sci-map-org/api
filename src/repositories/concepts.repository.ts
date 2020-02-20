import * as shortid from 'shortid';

import { generateUrlKey } from '../api/util/urlKey';
import { Concept, ConceptLabel } from '../entities/Concept';
import { Domain, DomainLabel } from '../entities/Domain';
import { ConceptBelongsToDomainLabel } from '../entities/relationships/ConceptBelongsToDomain';
import { ResourceCoversConceptLabel } from '../entities/relationships/ResourceCoversConcept';
import { UserKnowsConcept, UserKnowsConceptLabel } from '../entities/relationships/UserKnowsConcept';
import { Resource, ResourceLabel } from '../entities/Resource';
import { UserLabel } from '../entities/User';
import { neo4jDriver } from '../infra/neo4j';
import {
  attachNodes,
  createRelatedNode,
  deleteOne,
  findOne,
  getFilterString,
  getRelatedNode,
  getRelatedNodes,
  updateOne,
} from './util/abstract_graph_repo';

interface CreateConceptData {
  name: string;
  key?: string;
  description?: string;
}

interface UpdateConceptData {
  key?: string;
  name?: string;
  description?: string;
}

export const createConcept = (user: { _id: string } | { key: string }, data: CreateConceptData): Promise<Concept> =>
  createRelatedNode({
    originNode: { label: 'User', filter: user },
    relationship: { label: 'CREATED', props: { createdAt: Date.now() } },
    newNode: {
      label: ConceptLabel,
      props: {
        ...data,
        key: generateUrlKey(data.key || data.name), // a bit ugly
        _id: shortid.generate(),
      },
    },
  });

export const findConcept = findOne<Concept, { _id: string } | { key: string }>({ label: ConceptLabel });

export const updateConcept = updateOne<Concept, { _id: string }, UpdateConceptData>({ label: ConceptLabel });

export const deleteConcept = deleteOne<Concept, { _id: string }>({ label: ConceptLabel });

export const attachConceptToDomain = (conceptId: string, domainId: string) =>
  attachNodes({
    originNode: { label: ConceptLabel, filter: { _id: conceptId } },
    relationship: { label: ConceptBelongsToDomainLabel, props: {} },
    destinationNode: { label: DomainLabel, filter: { _id: domainId } },
  });

export const getConceptDomain = (conceptId: string) =>
  getRelatedNode<Domain>({
    originNode: { label: ConceptLabel, filter: { _id: conceptId } },
    relationship: { label: ConceptBelongsToDomainLabel, filter: {} },
    destinationNode: { label: DomainLabel, filter: {} },
  });

export const getConceptCoveredByResources = (_id: string) =>
  getRelatedNodes<Resource>({
    originNode: {
      label: ConceptLabel,
      filter: { _id },
    },
    relationship: {
      label: ResourceCoversConceptLabel,
      filter: {},
    },
    destinationNode: {
      label: ResourceLabel,
      filter: {},
    },
  });

export const getUserKnowsConcept = async (userId: string, conceptId: string): Promise<UserKnowsConcept | null> => {
  const session = neo4jDriver.session();
  const { records } = await session.run(
    `MATCH (originNode:${UserLabel} ${getFilterString(
      { _id: userId },
      'originNodeFilter'
    )})-[relationship:${UserKnowsConceptLabel} ${getFilterString(
      {},
      'relationshipFilter'
    )}]-(destinationNode:${ConceptLabel} ${getFilterString(
      { _id: conceptId },
      'destinationNodeFilter'
    )}) RETURN properties(destinationNode) as destinationNode, properties(originNode) as originNode, properties(relationship) as relationship`,
    {
      originNodeFilter: { _id: userId },
      relationshipFilter: {},
      destinationNodeFilter: { _id: conceptId },
    }
  );

  session.close();
  const record = records.pop();
  if (!record) return null;
  const result = record.get('relationship');
  return result;
};
