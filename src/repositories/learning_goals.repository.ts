import * as shortid from 'shortid';
import { generateUrlKey } from '../api/util/urlKey';
import { Domain, DomainLabel } from '../entities/Domain';
import { LearningGoal, LearningGoalLabel } from '../entities/LearningGoal';
import {
  LearningGoalBelongsToDomain,
  LearningGoalBelongsToDomainLabel,
} from '../entities/relationships/LearningGoalBelongsToDomain';
import {
  UserCreatedLearningGoal,
  UserCreatedLearningGoalLabel,
} from '../entities/relationships/UserCreatedLearningGoal';
import { User, UserLabel } from '../entities/User';
import {
  attachUniqueNodes,
  createRelatedNode,
  deleteOne,
  detachUniqueNodes,
  findOne,
  getOptionalRelatedNode,
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
  domainId: string
): Promise<{ domain: Domain; learningGoal: LearningGoal }> =>
  attachUniqueNodes<LearningGoal, LearningGoalBelongsToDomain, Domain>({
    originNode: { label: LearningGoalLabel, filter: { _id: learningGoalId } },
    relationship: { label: LearningGoalBelongsToDomainLabel, onCreateProps: {} },
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

export const getLearningGoalDomains = (learningGoalId: string): Promise<Domain[]> =>
  getRelatedNodes<LearningGoal, LearningGoalBelongsToDomain, Domain>({
    originNode: {
      label: LearningGoalLabel,
      filter: {
        _id: learningGoalId,
      },
    },
    relationship: {
      label: LearningGoalBelongsToDomainLabel,
    },
    destinationNode: {
      label: DomainLabel,
    },
  }).then(items => items.map(({ destinationNode }) => destinationNode));

function generateLearningGoalKey(name: string) {
  return shortid.generate() + '_' + generateUrlKey(name);
}
