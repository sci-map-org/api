import * as shortid from 'shortid';

import { Concept, ConceptLabel } from '../entities/Concept';
import {
  createRelatedNode,
  deleteOne,
  findOne,
  updateOne,
  attachNodes,
  getRelatedNode,
  getRelatedNodes,
} from './util/abstract_graph_repo';
import { DomainLabel, Domain } from '../entities/Domain';
import { ConceptBelongsToDomainLabel } from '../entities/relationships/ConceptBelongsToDomain';
import { Resource, ResourceLabel } from '../entities/Resource';
import { ResourceCoversConceptLabel } from '../entities/relationships/ResourceCoversConcept';
import { generateUrlKey } from '../api/util/urlKey';

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
