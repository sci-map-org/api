import { node, Query, relation } from 'cypher-query-builder';
import { map, prop } from 'ramda';
import { Concept, ConceptLabel } from '../entities/Concept';
import { Domain, DomainLabel } from '../entities/Domain';
import { LearningGoal, LearningGoalLabel } from '../entities/LearningGoal';
import { LearningMaterial, LearningMaterialLabel } from '../entities/LearningMaterial';
import { ConceptBelongsToDomainLabel } from '../entities/relationships/ConceptBelongsToDomain';
import {
  LearningMaterialBelongsToDomain,
  LearningMaterialBelongsToDomainLabel,
} from '../entities/relationships/LearningMaterialBelongsToDomain';
import {
  LearningMaterialCoversConcept,
  LearningMaterialCoversConceptLabel,
} from '../entities/relationships/LearningMaterialCoversConcept';
import {
  LearningMaterialHasPrerequisiteLearningGoal,
  LearningMaterialHasPrerequisiteLearningGoalLabel,
} from '../entities/relationships/LearningMaterialHasPrerequisiteLearningGoal';
import {
  LearningMaterialLeadsToLearningGoal,
  LearningMaterialLeadsToLearningGoalLabel,
} from '../entities/relationships/LearningMaterialLeadsToLearningGoal';
import {
  UserRatedLearningMaterial,
  UserRatedLearningMaterialLabel,
} from '../entities/relationships/UserRatedLearningMaterial';
import { User, UserLabel } from '../entities/User';
import { NotFoundError } from '../errors/NotFoundError';
import { logger } from '../infra/logger';
import { neo4jQb } from '../infra/neo4j';
import {
  attachUniqueNodes,
  detachUniqueNodes,
  findOne,
  attachNodes,
  detachNodes,
  getRelatedNodes,
} from './util/abstract_graph_repo';

export const findLearningMaterial = (learningMaterialId: string) =>
  findOne<LearningMaterial, { _id: string }>({ label: LearningMaterialLabel })({ _id: learningMaterialId });

export const rateLearningMaterial = async (
  userId: string,
  learningMaterialId: string,
  value: number
): Promise<LearningMaterial> =>
  attachUniqueNodes<User, UserRatedLearningMaterial, LearningMaterial>({
    originNode: {
      label: UserLabel,
      filter: { _id: userId },
    },
    relationship: {
      label: UserRatedLearningMaterialLabel,
      onCreateProps: {
        value,
      },
      onMergeProps: {
        value,
      },
    },
    destinationNode: {
      label: LearningMaterialLabel,
      filter: {
        _id: learningMaterialId,
      },
    },
  }).then(({ destinationNode }) => {
    return destinationNode;
  });

export const getLearningMaterialRating = async (learningMaterialId: string): Promise<number | null> => {
  const q = new Query(neo4jQb);
  q.match([
    node('lm', LearningMaterialLabel),
    relation('in', 'rel', UserRatedLearningMaterialLabel),
    node(undefined, UserLabel),
  ]);
  q.where({ lm: { _id: learningMaterialId } });
  q.with(['avg(rel.value) AS rating']);
  q.return('rating');
  const results = await q.run();

  const result = results.pop();
  if (!result) throw new Error('Unable to compute rating');
  return result.rating ? Number(result.rating.toString()) : null;
};

export const attachLearningMaterialToDomain = (learningMaterialId: string, domainId: string) =>
  attachUniqueNodes<LearningMaterial, LearningMaterialBelongsToDomain, Domain>({
    originNode: { label: LearningMaterialLabel, filter: { _id: learningMaterialId } },
    relationship: { label: LearningMaterialBelongsToDomainLabel },
    destinationNode: { label: DomainLabel, filter: { _id: domainId } },
  }).then(({ originNode, destinationNode }) => ({ domain: destinationNode, learningMaterial: originNode }));

export const detachLearningMaterialFromDomain = (learningMaterialId: string, domainId: string) =>
  detachUniqueNodes<LearningMaterial, LearningMaterialBelongsToDomain, Domain>({
    originNode: {
      label: LearningMaterialLabel,
      filter: { _id: learningMaterialId },
    },
    relationship: {
      label: LearningMaterialBelongsToDomainLabel,
      filter: {},
    },
    destinationNode: {
      label: DomainLabel,
      filter: { _id: domainId },
    },
  }).then(({ originNode, destinationNode }) => ({ domain: destinationNode, learningMaterial: originNode }));

export const attachLearningMaterialCoversConcepts = (
  learningMaterialId: string,
  conceptIds: string[],
  props: { userId: string }
): Promise<{ learningMaterial: LearningMaterial; concepts: Concept[] }> =>
  attachNodes<LearningMaterial, LearningMaterialCoversConcept, Concept>({
    originNode: { label: LearningMaterialLabel, filter: { _id: learningMaterialId } },
    relationship: { label: LearningMaterialCoversConceptLabel, onCreateProps: props },
    destinationNode: { label: ConceptLabel, filter: { _id: { $in: conceptIds } } },
  }).then(items => {
    if (items.length !== conceptIds.length)
      logger.warn(
        'attachLearningMaterialCoversConcepts: some concepts in ' + JSON.stringify(conceptIds) + ' not found'
      );
    if (!items.length) throw new NotFoundError('LearningMaterial', learningMaterialId); // TODO: fix, because right it throws this error when no concepts are passed
    return {
      learningMaterial: items[0].originNode,
      concepts: items.map(({ destinationNode }) => destinationNode),
    };
  });

export const detachLearningMaterialCoversConcepts = (
  learningMaterialId: string,
  conceptIds: string[]
): Promise<{ learningMaterial: LearningMaterial; concepts: Concept[] }> =>
  detachNodes<LearningMaterial, LearningMaterialCoversConcept, Concept>({
    originNode: {
      label: LearningMaterialLabel,
      filter: { _id: learningMaterialId },
    },
    relationship: {
      label: LearningMaterialCoversConceptLabel,
      filter: {},
    },
    destinationNode: {
      label: ConceptLabel,
      filter: { _id: { $in: conceptIds } },
    },
  }).then(items => {
    if (items.length !== conceptIds.length)
      logger.warn(
        'attachLearningMaterialCoversConcepts: some concepts in ' + JSON.stringify(conceptIds) + ' not found'
      );
    if (!items.length) throw new NotFoundError('LearningMaterial', learningMaterialId);
    return {
      learningMaterial: items[0].originNode,
      concepts: items.map(({ destinationNode }) => destinationNode),
    };
  });

export const getLearningMaterialCoveredConcepts = (_id: string): Promise<Concept[]> =>
  getRelatedNodes<LearningMaterial, LearningMaterialCoversConcept, Concept>({
    originNode: {
      label: LearningMaterialLabel,
      filter: { _id },
    },
    relationship: {
      label: LearningMaterialCoversConceptLabel,
    },
    destinationNode: {
      label: ConceptLabel,
    },
  }).then(map(prop('destinationNode')));

export const getLearningMaterialCoveredConceptsByDomain = async (
  learningMaterialId: string
): Promise<{ domain: Domain; coveredConcepts: Concept[] }[]> => {
  const q = new Query(neo4jQb);
  q.match([
    node('learningMaterial', LearningMaterialLabel, { _id: learningMaterialId }),
    relation('out', '', LearningMaterialBelongsToDomainLabel),
    node('domain', DomainLabel),
  ]);
  q.optionalMatch([
    node('learningMaterial'),
    relation('out', '', LearningMaterialCoversConceptLabel),
    node('concept', ConceptLabel),
    relation('out', '', ConceptBelongsToDomainLabel),
    node('domain', DomainLabel),
  ]);
  q.raw('WITH DISTINCT domain, collect(concept) as concepts RETURN *');

  const results = await q.run();
  return results.map(r => ({
    domain: r.domain.properties,
    coveredConcepts: r.concepts.map(c => c.properties),
  }));
};

export const getLearningMaterialDomains = (_id: string) =>
  getRelatedNodes<LearningMaterial, LearningMaterialBelongsToDomain, Domain>({
    originNode: {
      label: LearningMaterialLabel,
      filter: { _id },
    },
    relationship: {
      label: LearningMaterialBelongsToDomainLabel,
    },
    destinationNode: {
      label: DomainLabel,
    },
  }).then(map(prop('destinationNode')));

// TODO: optimize by attaching several learning goals to an lm in one query
export const attachLearningMaterialHasPrerequisiteLearningGoal = async (
  learningMaterialId: string,
  learningGoalId: string,
  data: Omit<LearningMaterialHasPrerequisiteLearningGoal, 'createdAt'>
): Promise<{ learningMaterial: LearningMaterial; learningGoal: LearningGoal }> =>
  attachUniqueNodes<LearningMaterial, LearningMaterialHasPrerequisiteLearningGoal, LearningGoal>({
    originNode: {
      label: LearningMaterialLabel,
      filter: { _id: learningMaterialId },
    },
    relationship: {
      label: LearningMaterialHasPrerequisiteLearningGoalLabel,
      onCreateProps: {
        ...data,
        createdAt: Date.now(),
      },
    },
    destinationNode: {
      label: LearningGoalLabel,
      filter: { _id: learningGoalId },
    },
  }).then(({ destinationNode, originNode }) => ({ learningMaterial: originNode, learningGoal: destinationNode }));

export const detachLearningMaterialHasPrerequisiteLearningGoal = (
  learningMaterialId: string,
  learningGoalId: string
): Promise<{ learningMaterial: LearningMaterial; learningGoal: LearningGoal }> =>
  detachUniqueNodes<LearningMaterial, LearningMaterialHasPrerequisiteLearningGoal, LearningGoal>({
    originNode: {
      label: LearningMaterialLabel,
      filter: { _id: learningMaterialId },
    },
    relationship: {
      label: LearningMaterialHasPrerequisiteLearningGoalLabel,
      filter: {},
    },
    destinationNode: {
      label: LearningGoalLabel,
      filter: { _id: learningGoalId },
    },
  }).then(({ originNode, destinationNode }) => ({ learningMaterial: originNode, learningGoal: destinationNode }));

// TODO: optimize by attaching several learning goals to an lm in one query
export const attachLearningMaterialLeadsToLearningGoal = async (
  learningMaterialId: string,
  learningGoalId: string,
  data: Omit<LearningMaterialLeadsToLearningGoal, 'createdAt'>
): Promise<{ learningMaterial: LearningMaterial; learningGoal: LearningGoal }> =>
  attachUniqueNodes<LearningMaterial, LearningMaterialLeadsToLearningGoal, LearningGoal>({
    originNode: {
      label: LearningMaterialLabel,
      filter: { _id: learningMaterialId },
    },
    relationship: {
      label: LearningMaterialLeadsToLearningGoalLabel,
      onCreateProps: {
        ...data,
        createdAt: Date.now(),
      },
    },
    destinationNode: {
      label: LearningGoalLabel,
      filter: { _id: learningGoalId },
    },
  }).then(({ destinationNode, originNode }) => ({ learningMaterial: originNode, learningGoal: destinationNode }));

export const detachLearningMaterialLeadsToLearningGoal = (
  learningMaterialId: string,
  learningGoalId: string
): Promise<{ learningMaterial: LearningMaterial; learningGoal: LearningGoal }> =>
  detachUniqueNodes<LearningMaterial, LearningMaterialLeadsToLearningGoal, LearningGoal>({
    originNode: {
      label: LearningMaterialLabel,
      filter: { _id: learningMaterialId },
    },
    relationship: {
      label: LearningMaterialLeadsToLearningGoalLabel,
      filter: {},
    },
    destinationNode: {
      label: LearningGoalLabel,
      filter: { _id: learningGoalId },
    },
  }).then(({ originNode, destinationNode }) => ({ learningMaterial: originNode, learningGoal: destinationNode }));

export const getLearningMaterialPrerequisites = (
  learningMaterialId: string
): Promise<{ learningGoal: LearningGoal; relationship: LearningMaterialHasPrerequisiteLearningGoal }[]> =>
  getRelatedNodes<LearningMaterial, LearningMaterialHasPrerequisiteLearningGoal, LearningGoal>({
    originNode: {
      label: LearningMaterialLabel,
      filter: { _id: learningMaterialId },
    },
    relationship: {
      label: LearningMaterialHasPrerequisiteLearningGoalLabel,
    },
    destinationNode: {
      label: LearningGoalLabel,
      filter: { hidden: false },
    },
  }).then(items => items.map(({ destinationNode, relationship }) => ({ relationship, learningGoal: destinationNode })));

export const getLearningMaterialOutcomes = (
  learningMaterialId: string
): Promise<{ learningGoal: LearningGoal; relationship: LearningMaterialLeadsToLearningGoal }[]> =>
  getRelatedNodes<LearningMaterial, LearningMaterialLeadsToLearningGoal, LearningGoal>({
    originNode: {
      label: LearningMaterialLabel,
      filter: { _id: learningMaterialId },
    },
    relationship: {
      label: LearningMaterialLeadsToLearningGoalLabel,
    },
    destinationNode: {
      label: LearningGoalLabel,
      filter: { hidden: false },
    },
  }).then(items => items.map(({ destinationNode, relationship }) => ({ relationship, learningGoal: destinationNode })));
