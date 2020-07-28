import { map, prop } from 'ramda';
import * as shortid from 'shortid';
import { generateUrlKey } from '../api/util/urlKey';
import { Concept, ConceptLabel } from '../entities/Concept';
import { Domain, DomainLabel } from '../entities/Domain';
import { ConceptBelongsToDomain, ConceptBelongsToDomainLabel } from '../entities/relationships/ConceptBelongsToDomain';
import {
  ConceptReferencesConcept,
  ConceptReferencesConceptLabel,
  STRENGTH_DEFAULT_VALUE,
} from '../entities/relationships/ConceptReferencesConcept';
import { ResourceCoversConcept, ResourceCoversConceptLabel } from '../entities/relationships/ResourceCoversConcept';
import { UserKnowsConcept, UserKnowsConceptLabel } from '../entities/relationships/UserKnowsConcept';
import { Resource, ResourceLabel } from '../entities/Resource';
import { User, UserLabel } from '../entities/User';
import {
  attachUniqueNodes,
  createRelatedNode,
  deleteOne,
  detachUniqueNodes,
  findOne,
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

export const attachConceptToDomain = (
  conceptId: string,
  domainId: string,
  { index }: { index: number }
): Promise<{
  concept: Concept;
  relationship: ConceptBelongsToDomain;
  domain: Domain;
}> =>
  attachUniqueNodes<Concept, ConceptBelongsToDomain, Domain>({
    originNode: { label: ConceptLabel, filter: { _id: conceptId } },
    relationship: { label: ConceptBelongsToDomainLabel, onCreateProps: { index } },
    destinationNode: { label: DomainLabel, filter: { _id: domainId } },
  }).then(({ originNode, relationship, destinationNode }) => {
    return {
      concept: originNode,
      relationship,
      domain: destinationNode,
    };
  });

export const updateConceptBelongsToDomain = (
  conceptId: string,
  domainId: string,
  data: { index?: number }
): Promise<{
  concept: Concept;
  relationship: ConceptBelongsToDomain;
  domain: Domain;
}> =>
  attachUniqueNodes<Concept, ConceptBelongsToDomain, Domain>({
    originNode: { label: ConceptLabel, filter: { _id: conceptId } },
    relationship: { label: ConceptBelongsToDomainLabel, onMergeProps: data },
    destinationNode: { label: DomainLabel, filter: { _id: domainId } },
  }).then(({ originNode, relationship, destinationNode }) => {
    return {
      concept: originNode,
      relationship,
      domain: destinationNode,
    };
  });

export const getConceptDomain = (conceptId: string) =>
  getRelatedNode<Domain>({
    originNode: { label: ConceptLabel, filter: { _id: conceptId } },
    relationship: { label: ConceptBelongsToDomainLabel, filter: {} },
    destinationNode: { label: DomainLabel, filter: {} },
  });

export const getConceptCoveredByResources = (_id: string): Promise<Resource[]> =>
  getRelatedNodes<Concept, ResourceCoversConcept, Resource>({
    originNode: {
      label: ConceptLabel,
      filter: { _id },
    },
    relationship: {
      label: ResourceCoversConceptLabel,
    },
    destinationNode: {
      label: ResourceLabel,
    },
  })
    .then(prop('items'))
    .then(map(prop('destinationNode')));

export const getUserKnowsConcept = async (userId: string, conceptId: string): Promise<UserKnowsConcept | null> => {
  const { items } = await getRelatedNodes<User, UserKnowsConcept, Concept>({
    originNode: {
      label: UserLabel,
      filter: { _id: userId },
    },
    relationship: {
      label: UserKnowsConceptLabel,
    },
    destinationNode: {
      label: ConceptLabel,
      filter: {
        _id: conceptId,
      },
    },
  });
  const [result] = items;
  if (!result) return null;
  return result.relationship;
};

export const attachConceptReferencesConcept = (
  referencedConceptId: string,
  referencingConceptId: string,
  strength?: number
): Promise<{ referencedConcept: Concept; relationship: ConceptReferencesConcept; referencingConcept: Concept }> =>
  attachUniqueNodes<Concept, ConceptReferencesConcept, Concept>({
    originNode: { label: ConceptLabel, filter: { _id: referencingConceptId } },
    relationship: {
      label: ConceptReferencesConceptLabel,
      onCreateProps: { strength: strength || STRENGTH_DEFAULT_VALUE },
      onMergeProps: { strength },
    },
    destinationNode: { label: ConceptLabel, filter: { _id: referencedConceptId } },
  }).then(({ originNode, relationship, destinationNode }) => {
    return {
      referencedConcept: originNode,
      relationship,
      referencingConcept: destinationNode,
    };
  });

export const detachConceptReferencesConcept = (
  referencedConceptId: string,
  referencingConceptId: string
): Promise<{ referencedConcept: Concept; referencingConcept: Concept }> =>
  detachUniqueNodes<Concept, ConceptReferencesConcept, Concept>({
    originNode: {
      label: ConceptLabel,
      filter: { _id: referencingConceptId },
    },
    relationship: {
      label: ConceptReferencesConceptLabel,
      filter: {},
    },
    destinationNode: {
      label: ConceptLabel,
      filter: { _id: referencedConceptId },
    },
  }).then(({ originNode, destinationNode }) => {
    return {
      referencingConcept: originNode,
      referencedConcept: destinationNode,
    };
  });

const m: { [key in 'PARENTS' | 'CHILDREN']: 'IN' | 'OUT' } = {
  PARENTS: 'OUT',
  CHILDREN: 'IN',
};

const getConceptReferences = (filter: { _id: string } | { key: string }, direction: 'PARENTS' | 'CHILDREN') =>
  getRelatedNodes<Concept, ConceptReferencesConcept, Concept>({
    originNode: {
      label: ConceptLabel,
      filter,
    },
    relationship: {
      label: ConceptReferencesConceptLabel,
      direction: m[direction],
    },
    destinationNode: {
      label: ConceptLabel,
    },
  }).then(({ items }) => items.map(item => ({ concept: item.destinationNode, relationship: item.relationship })));

export const getConceptsReferencedByConcept = (filter: { _id: string } | { key: string }) =>
  getConceptReferences(filter, 'CHILDREN');

export const getConceptsReferencingConcept = (filter: { _id: string } | { key: string }) =>
  getConceptReferences(filter, 'PARENTS');
