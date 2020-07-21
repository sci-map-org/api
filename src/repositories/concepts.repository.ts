import { map, prop } from 'ramda';
import * as shortid from 'shortid';
import { generateUrlKey } from '../api/util/urlKey';
import { Concept, ConceptLabel } from '../entities/Concept';
import { Domain, DomainLabel } from '../entities/Domain';
import { ConceptBelongsToDomain, ConceptBelongsToDomainLabel } from '../entities/relationships/ConceptBelongsToDomain';
import {
  ConceptDependsOnConcept,
  ConceptDependsOnConceptLabel,
  STRENGTH_DEFAULT_VALUE,
} from '../entities/relationships/ConceptDependsOnConcept';
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

export const attachConceptDependencyToConcept = (
  dependedUponConceptId: string,
  dependingConceptId: string,
  strength?: number
): Promise<{ dependedUponConcept: Concept; relationship: ConceptDependsOnConcept; dependingConcept: Concept }> =>
  attachUniqueNodes<Concept, ConceptDependsOnConcept, Concept>({
    originNode: { label: ConceptLabel, filter: { _id: dependingConceptId } },
    relationship: {
      label: ConceptDependsOnConceptLabel,
      onCreateProps: { strength: strength || STRENGTH_DEFAULT_VALUE },
      onMergeProps: { strength },
    },
    destinationNode: { label: ConceptLabel, filter: { _id: dependedUponConceptId } },
  }).then(({ originNode, relationship, destinationNode }) => {
    return {
      dependedUponConcept: originNode,
      relationship,
      dependingConcept: destinationNode,
    };
  });

export const detachConceptDependencyToConcept = (
  dependedUponConceptId: string,
  dependingConceptId: string
): Promise<{ dependedUponConcept: Concept; dependingConcept: Concept }> =>
  detachUniqueNodes<Concept, ConceptDependsOnConcept, Concept>({
    originNode: {
      label: ConceptLabel,
      filter: { _id: dependingConceptId },
    },
    relationship: {
      label: ConceptDependsOnConceptLabel,
      filter: {},
    },
    destinationNode: {
      label: ConceptLabel,
      filter: { _id: dependedUponConceptId },
    },
  }).then(({ originNode, destinationNode }) => {
    return {
      dependingConcept: originNode,
      dependedUponConcept: destinationNode,
    };
  });

const m: { [key in 'PARENTS' | 'CHILDREN']: 'IN' | 'OUT' } = {
  PARENTS: 'OUT',
  CHILDREN: 'IN',
};

export const getConceptDependencies = (
  filter: { _id?: string } | { key?: string },
  direction: 'PARENTS' | 'CHILDREN'
) =>
  getRelatedNodes<Concept, ConceptDependsOnConcept, Concept>({
    originNode: {
      label: ConceptLabel,
      filter,
    },
    relationship: {
      label: ConceptDependsOnConceptLabel,
      direction: m[direction],
    },
    destinationNode: {
      label: ConceptLabel,
    },
  }).then(({ items }) => items.map(item => ({ concept: item.destinationNode, relationship: item.relationship })));
