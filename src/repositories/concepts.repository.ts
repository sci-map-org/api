import * as shortid from 'shortid';

import { Concept, ConceptLabel } from '../entities/Concept';
import { createRelatedNode, deleteOne, findOne, updateOne, attachNodes } from './util/abstract_graph_repo';
import { DomainLabel } from '../entities/Domain';
import { ConceptDomainBelongsToLabel } from '../entities/relationships/ConceptDomainBelongsTo';

interface CreateConceptData {
  name: string;
  description?: string;
}

interface UpdateConceptData {
  name?: string;
  description?: string;
}

export const createConcept = (user: { _id: string } | { key: string }, data: CreateConceptData): Promise<Concept> =>
  createRelatedNode({
    originNode: { label: 'User', filter: user },
    relationship: { label: 'CREATED', props: { createdAt: Date.now() } },
    newNode: { label: ConceptLabel, props: { ...data, _id: shortid.generate() } },
  });

export const findConcept = findOne<Concept, { _id: string }>({ label: ConceptLabel });

export const updateConcept = updateOne<Concept, { _id: string }, UpdateConceptData>({ label: ConceptLabel });

export const deleteConcept = deleteOne<Concept, { _id: string }>({ label: ConceptLabel });

export const attachConceptToDomain = (conceptId: string, domainId: string) =>
  attachNodes({
    originNode: { label: ConceptLabel, filter: { _id: conceptId } },
    relationship: { label: ConceptDomainBelongsToLabel, props: {} },
    destinationNode: { label: DomainLabel, filter: { _id: domainId } },
  });
