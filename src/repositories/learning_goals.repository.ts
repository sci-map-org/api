import * as shortid from 'shortid';
import { generateUrlKey } from '../api/util/urlKey';
import { Concept, ConceptLabel } from '../entities/Concept';
import { Domain, DomainLabel } from '../entities/Domain';
import { LearningGoal, LearningGoalLabel } from '../entities/LearningGoal';
import {
  LearningGoalBelongsToDomain,
  LearningGoalBelongsToDomainLabel,
} from '../entities/relationships/LearningGoalBelongsToDomain';
import { DEFAULT_INDEX_VALUE } from '../entities/relationships/TopicBelongsToDomain';
import {
  LearningGoalRequiresConcept,
  LearningGoalRequiresConceptLabel,
} from '../entities/relationships/LearningGoalRequiresConcept';
import {
  LearningGoalRequiresLearningGoal,
  LearningGoalRequiresLearningGoalLabel,
} from '../entities/relationships/LearningGoalRequiresLearningGoal';
import {
  UserCreatedLearningGoal,
  UserCreatedLearningGoalLabel,
} from '../entities/relationships/UserCreatedLearningGoal';
import { User, UserLabel } from '../entities/User';
import { neo4jDriver } from '../infra/neo4j';
import {
  attachUniqueNodes,
  createRelatedNode,
  deleteOne,
  detachUniqueNodes,
  findOne,
  getOptionalRelatedNode,
  getRelatedNode,
  getRelatedNodes,
  updateOne,
} from './util/abstract_graph_repo';

interface CreateLearningGoalData {
  name: string;
  key?: string;
  description?: string;
}
export const createLearningGoal = (
  userFilter: { _id: string } | { key: string },
  data: CreateLearningGoalData
): Promise<LearningGoal> =>
  createRelatedNode<User, UserCreatedLearningGoal, LearningGoal>({
    originNode: { label: UserLabel, filter: userFilter },
    relationship: { label: UserCreatedLearningGoalLabel, props: { createdAt: Date.now() } },
    newNode: {
      labels: [LearningGoalLabel],
      props: {
        ...data,
        _id: shortid.generate(),
        key: data.key ? generateUrlKey(data.key) : generateLearningGoalKey(data.name),
      },
    },
  });

interface UpdateLearningGoalData {
  name?: string;
  key?: string;
  description?: string;
}

export const updateLearningGoal = updateOne<LearningGoal, { _id: string } | { key: string }, UpdateLearningGoalData>({
  label: LearningGoalLabel,
});

export const findLearningGoal = findOne<LearningGoal, { key: string } | { _id: string }>({ label: LearningGoalLabel });

export const searchLearningGoals = async (
  { query }: { query?: string },
  pagination: { offset?: number; limit?: number }
): Promise<Domain[]> => {
  const session = neo4jDriver.session();
  const { records } = await session.run(
    `MATCH (node:${LearningGoalLabel}) ${
      query
        ? 'WHERE toLower(node.name) CONTAINS toLower($query) OR toLower(node.description) CONTAINS toLower($query)'
        : ''
    }RETURN properties(node) AS node${pagination && pagination.offset ? ' SKIP ' + pagination.offset : ''}${
      pagination && pagination.limit ? ' LIMIT ' + pagination.limit : ''
    }`,
    {
      query,
    }
  );
  session.close();
  return records.map(r => r.get('node'));
};
export const findLearningGoalCreatedBy = (
  userId: string,
  learningGoalFilter: { _id: string } | { key: string }
): Promise<LearningGoal | null> =>
  getOptionalRelatedNode<User, UserCreatedLearningGoal, LearningGoal>({
    originNode: { label: UserLabel, filter: { _id: userId } },
    relationship: { label: UserCreatedLearningGoalLabel, direction: 'OUT' },
    destinationNode: { label: LearningGoalLabel, filter: learningGoalFilter },
  }).then(result => (result ? result.destinationNode : null));

export const deleteLearningGoal = deleteOne<LearningGoal, { _id: string } | { key: string }>({
  label: LearningGoalLabel,
});

export const attachLearningGoalToDomain = (
  learningGoalId: string,
  domainId: string,
  { contextualKey, contextualName }: { contextualKey: string; contextualName: string }
): Promise<{ domain: Domain; learningGoal: LearningGoal }> =>
  attachUniqueNodes<LearningGoal, LearningGoalBelongsToDomain, Domain>({
    originNode: { label: LearningGoalLabel, filter: { _id: learningGoalId } },
    relationship: {
      label: LearningGoalBelongsToDomainLabel,
      onCreateProps: { index: DEFAULT_INDEX_VALUE, contextualKey, contextualName },
    },
    destinationNode: { label: DomainLabel, filter: { _id: domainId } },
  }).then(({ originNode, destinationNode }) => ({ learningGoal: originNode, domain: destinationNode }));

export const detachLearningGoalFromDomain = (
  learningGoalId: string,
  domainId: string
): Promise<{ domain: Domain; learningGoal: LearningGoal }> =>
  detachUniqueNodes<LearningGoal, LearningGoalBelongsToDomain, Domain>({
    originNode: { label: LearningGoalLabel, filter: { _id: learningGoalId } },
    relationship: { label: LearningGoalBelongsToDomainLabel, filter: {} },
    destinationNode: { label: DomainLabel, filter: { _id: domainId } },
  }).then(({ originNode, destinationNode }) => ({ learningGoal: originNode, domain: destinationNode }));

export const getLearningGoalDomain = (
  learningGoalId: string
): Promise<{ domain: Domain; relationship: LearningGoalBelongsToDomain; learningGoal: LearningGoal } | null> =>
  getOptionalRelatedNode<LearningGoal, LearningGoalBelongsToDomain, Domain>({
    originNode: {
      label: LearningGoalLabel,
      filter: {
        _id: learningGoalId,
      },
    },
    relationship: {
      label: LearningGoalBelongsToDomainLabel,
      filter: {},
    },
    destinationNode: {
      label: DomainLabel,
      filter: {},
    },
  }).then(data =>
    data ? { domain: data.destinationNode, relationship: data.relationship, learningGoal: data.originNode } : null
  );

export const findDomainLearningGoalByKey = (
  domainKey: string,
  contextualLearningGoalKey: string
): Promise<{ learningGoal: LearningGoal; domain: Domain } | null> =>
  getOptionalRelatedNode<Domain, LearningGoalBelongsToDomain, LearningGoal>({
    originNode: {
      label: DomainLabel,
      filter: { key: domainKey },
    },
    relationship: {
      label: LearningGoalBelongsToDomainLabel,
      direction: 'IN',
      filter: { contextualKey: contextualLearningGoalKey },
    },
    destinationNode: {
      label: LearningGoalLabel,
      filter: {},
    },
  }).then(result => (result ? { learningGoal: result.destinationNode, domain: result.originNode } : null));

function generateLearningGoalKey(name: string) {
  return shortid.generate() + '_' + generateUrlKey(name);
}

/**
 * TODO Cleanup once there's Topic ?
 */
export const attachLearningGoalRequiresSubGoal = async (
  learningGoalId: string,
  subGoalId: string,
  { strength }: { strength?: number }
): Promise<{ subGoal: LearningGoal | Concept; learningGoal: LearningGoal }> => {
  const subLearningGoal = await findLearningGoal({ _id: subGoalId });
  if (!!subLearningGoal) {
    return await attachLearningGoalRequiresLearningGoal(learningGoalId, subGoalId, { strength });
  }
  const { concept, learningGoal } = await attachLearningGoalRequiresConcept(learningGoalId, subGoalId, { strength });
  return { learningGoal, subGoal: concept };
};

const attachLearningGoalRequiresLearningGoal = (
  learningGoalId: string,
  subLearningGoalId: string,
  { strength }: { strength?: number }
): Promise<{ subGoal: LearningGoal; learningGoal: LearningGoal }> =>
  attachUniqueNodes<LearningGoal, LearningGoalRequiresLearningGoal, LearningGoal>({
    originNode: { label: LearningGoalLabel, filter: { _id: learningGoalId } },
    relationship: {
      label: LearningGoalRequiresLearningGoalLabel,
      onCreateProps: { strength: strength || 100 },
      onMergeProps: { strength },
    },
    destinationNode: { label: LearningGoalLabel, filter: { _id: subLearningGoalId } },
  }).then(({ originNode, destinationNode }) => ({ learningGoal: originNode, subGoal: destinationNode }));

const attachLearningGoalRequiresConcept = (
  learningGoalId: string,
  conceptId: string,
  { strength }: { strength?: number }
): Promise<{ concept: Concept; learningGoal: LearningGoal }> =>
  attachUniqueNodes<LearningGoal, LearningGoalRequiresConcept, Concept>({
    originNode: { label: LearningGoalLabel, filter: { _id: learningGoalId } },
    relationship: {
      label: LearningGoalRequiresConceptLabel,
      onCreateProps: { strength: strength || 100 },
      onMergeProps: { strength },
    },
    destinationNode: { label: ConceptLabel, filter: { _id: conceptId } },
  }).then(({ originNode, destinationNode }) => ({ learningGoal: originNode, concept: destinationNode }));

/**
 * TODO Cleanup once there's Topic ?
 */
export const detachLearningGoalRequiresSubGoal = async (
  learningGoalId: string,
  subGoalId: string
): Promise<{ subGoal: LearningGoal | Concept; learningGoal: LearningGoal }> => {
  const subLearningGoal = await findLearningGoal({ _id: subGoalId });
  if (!!subLearningGoal) {
    return await detachLearningGoalRequiresLearningGoal(learningGoalId, subGoalId);
  }
  const { concept, learningGoal } = await detachLearningGoalRequiresConcept(learningGoalId, subGoalId);
  return { learningGoal, subGoal: concept };
};

const detachLearningGoalRequiresLearningGoal = (
  learningGoalId: string,
  subLearningGoalId: string
): Promise<{ subGoal: LearningGoal; learningGoal: LearningGoal }> =>
  detachUniqueNodes<LearningGoal, LearningGoalRequiresLearningGoal, LearningGoal>({
    originNode: { label: LearningGoalLabel, filter: { _id: learningGoalId } },
    relationship: {
      label: LearningGoalRequiresLearningGoalLabel,
      filter: {},
    },
    destinationNode: { label: LearningGoalLabel, filter: { _id: subLearningGoalId } },
  }).then(({ originNode, destinationNode }) => ({ learningGoal: originNode, subGoal: destinationNode }));

const detachLearningGoalRequiresConcept = (
  learningGoalId: string,
  conceptId: string
): Promise<{ concept: Concept; learningGoal: LearningGoal }> =>
  detachUniqueNodes<LearningGoal, LearningGoalRequiresConcept, Concept>({
    originNode: { label: LearningGoalLabel, filter: { _id: learningGoalId } },
    relationship: {
      label: LearningGoalRequiresConceptLabel,
      filter: {},
    },
    destinationNode: { label: ConceptLabel, filter: { _id: conceptId } },
  }).then(({ originNode, destinationNode }) => ({ learningGoal: originNode, concept: destinationNode }));