import { map, prop } from 'ramda';
import * as shortid from 'shortid';

import { generateUrlKey } from '../api/util/urlKey';
import { Concept, ConceptLabel } from '../entities/Concept';
import { Domain, DomainLabel } from '../entities/Domain';
import { ConceptBelongsToDomainLabel, ConceptBelongsToDomain } from '../entities/relationships/ConceptBelongsToDomain';
import { ResourceCoversConcept, ResourceCoversConceptLabel } from '../entities/relationships/ResourceCoversConcept';
import { UserKnowsConcept, UserKnowsConceptLabel } from '../entities/relationships/UserKnowsConcept';
import { Resource, ResourceLabel } from '../entities/Resource';
import { User, UserLabel } from '../entities/User';
import {
  attachNodes,
  createRelatedNode,
  deleteOne,
  findOne,
  getRelatedNode,
  getRelatedNodes,
  updateOne,
} from './util/abstract_graph_repo';

// Rename abstract_grap repo to query builder or something like that ? query builder + abstraction layer for graph db
// in repo, provide the bare minimum for crud operation.
// in services, implements business cases: user consumed a resource for instance
// for read for instance, it might configuring getRelatedNodes for each relations(types + labels for instance),
// that would then be called with filters, pagination, sorting
// find many and include some of their relations is quite the same a find one and list a relation
// layered services ? a resolver or something connecting to the outside should
// idea: sub folders/files shared by many parents ? Basically a DAG. Should be shown in a different way. Would be
// amazing in order to see the dependencies
// below: file explorer: show parents, file, then children

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
  attachNodes<Concept, ConceptBelongsToDomain, Domain>({
    originNode: { label: ConceptLabel, filter: { _id: conceptId } },
    relationship: { label: ConceptBelongsToDomainLabel, onCreateProps: { index } },
    destinationNode: { label: DomainLabel, filter: { _id: domainId } },
  }).then(([first, ...rest]) => {
    if (!first) throw new Error(`${ConceptLabel} with id ${conceptId} or ${DomainLabel} with id ${domainId} not found`);
    if (rest.length > 1)
      throw new Error(`More than 1 pair ${ConceptLabel} with id ${conceptId} or ${DomainLabel} with id ${domainId}`);
    const { originNode, relationship, destinationNode } = first;
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
  attachNodes<Concept, ConceptBelongsToDomain, Domain>({
    originNode: { label: ConceptLabel, filter: { _id: conceptId } },
    relationship: { label: ConceptBelongsToDomainLabel, onMergeProps: data },
    destinationNode: { label: DomainLabel, filter: { _id: domainId } },
  }).then(([first, ...rest]) => {
    console.log(data);
    console.log(first);
    if (!first) throw new Error(`${ConceptLabel} with id ${conceptId} or ${DomainLabel} with id ${domainId} not found`);
    if (rest.length > 1)
      throw new Error(`More than 1 pair ${ConceptLabel} with id ${conceptId} or ${DomainLabel} with id ${domainId}`);
    const { originNode, relationship, destinationNode } = first;
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
