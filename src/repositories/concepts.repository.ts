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
import { LearningMaterialCoversConcept, LearningMaterialCoversConceptLabel } from '../entities/relationships/LearningMaterialCoversConcept';
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
  getOptionalRelatedNode,
} from './util/abstract_graph_repo';
import {
  ConceptBelongsToConcept,
  ConceptBelongsToConceptLabel,
  DEFAULT_INDEX_VALUE,
} from '../entities/relationships/ConceptBelongsToConcept';
import { UserCreatedConceptLabel, UserCreatedConcept } from '../entities/relationships/UserCreatedConcept';

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
  createRelatedNode<User, UserCreatedConcept, Concept>({
    originNode: { label: UserLabel, filter: user },
    relationship: { label: UserCreatedConceptLabel, props: { createdAt: Date.now() } },
    newNode: {
      labels: [ConceptLabel],
      props: {
        ...data,
        key: generateUrlKey(data.key || data.name), // a bit ugly
        _id: shortid.generate(),
      },
    },
  });

export const findConcept = findOne<Concept, { _id: string }>({ label: ConceptLabel });

export const findDomainConceptByKey = (domainKey: string, conceptKey: string): Promise<Concept | null> =>
  getOptionalRelatedNode<Domain, ConceptBelongsToDomain, Concept>({
    originNode: {
      label: DomainLabel,
      filter: { key: domainKey },
    },
    relationship: {
      label: ConceptBelongsToDomainLabel,
      direction: 'IN',
    },
    destinationNode: {
      label: ConceptLabel,
      filter: { key: conceptKey },
    },
  });

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
  getRelatedNodes<Concept, LearningMaterialCoversConcept, Resource>({
    originNode: {
      label: ConceptLabel,
      filter: { _id },
    },
    relationship: {
      label: LearningMaterialCoversConceptLabel,
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
      referencingConcept: originNode,
      relationship,
      referencedConcept: destinationNode,
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

const getConceptReferences = (filter: { _id: string } | { key: string }, direction: 'OUT' | 'IN') =>
  getRelatedNodes<Concept, ConceptReferencesConcept, Concept>({
    originNode: {
      label: ConceptLabel,
      filter,
    },
    relationship: {
      label: ConceptReferencesConceptLabel,
      direction,
    },
    destinationNode: {
      label: ConceptLabel,
    },
  }).then(({ items }) => items.map(item => ({ concept: item.destinationNode, relationship: item.relationship })));

export const getConceptsReferencedByConcept = (filter: { _id: string } | { key: string }) =>
  getConceptReferences(filter, 'OUT');

export const getConceptsReferencingConcept = (filter: { _id: string } | { key: string }) =>
  getConceptReferences(filter, 'IN');

export const attachConceptBelongsToConcept = (
  parentConceptId: string,
  subConceptId: string,
  index?: number
): Promise<{ subConcept: Concept; relationship: ConceptBelongsToConcept; parentConcept: Concept }> =>
  attachUniqueNodes<Concept, ConceptBelongsToConcept, Concept>({
    originNode: { label: ConceptLabel, filter: { _id: subConceptId } },
    relationship: {
      label: ConceptBelongsToConceptLabel,
      onCreateProps: { index: index || DEFAULT_INDEX_VALUE },
      onMergeProps: { index },
    },
    destinationNode: { label: ConceptLabel, filter: { _id: parentConceptId } },
  }).then(({ originNode, relationship, destinationNode }) => {
    return {
      subConcept: originNode,
      relationship,
      parentConcept: destinationNode,
    };
  });

export const detachConceptBelongsToConcept = (
  parentConceptId: string,
  subConceptId: string
): Promise<{ subConcept: Concept; parentConcept: Concept }> =>
  detachUniqueNodes<Concept, ConceptBelongsToConcept, Concept>({
    originNode: {
      label: ConceptLabel,
      filter: { _id: subConceptId },
    },
    relationship: {
      label: ConceptBelongsToConceptLabel,
      filter: {},
    },
    destinationNode: {
      label: ConceptLabel,
      filter: { _id: parentConceptId },
    },
  }).then(({ originNode, destinationNode }) => {
    return {
      subConcept: originNode,
      parentConcept: destinationNode,
    };
  });

const getConceptBelongsToConcepts = (filter: { _id: string } | { key: string }, direction: 'IN' | 'OUT') =>
  getRelatedNodes<Concept, ConceptBelongsToConcept, Concept>({
    originNode: {
      label: ConceptLabel,
      filter,
    },
    relationship: {
      label: ConceptBelongsToConceptLabel,
      direction,
    },
    destinationNode: {
      label: ConceptLabel,
    },
  }).then(({ items }) => items.map(item => ({ concept: item.destinationNode, relationship: item.relationship })));

export const getConceptSubConcepts = (filter: { _id: string } | { key: string }) =>
  getConceptBelongsToConcepts(filter, 'IN');

export const getConceptParentConcepts = (filter: { _id: string } | { key: string }) =>
  getConceptBelongsToConcepts(filter, 'OUT');
