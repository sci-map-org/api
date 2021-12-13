import { node, Query, relation } from 'cypher-query-builder';
import { map, prop } from 'ramda';
import { LearningGoal, LearningGoalLabel } from '../entities/LearningGoal';
import { LearningMaterial, LearningMaterialLabel } from '../entities/LearningMaterial';
import { LearningGoalShowedInTopicLabel } from '../entities/relationships/LearningGoalShowedInTopic';
import {
  LearningMaterialCoversTopic,
  LearningMaterialCoversTopicLabel,
} from '../entities/relationships/LearningMaterialCoversTopic';
import {
  LearningMaterialHasPrerequisiteLearningGoal,
  LearningMaterialHasPrerequisiteLearningGoalLabel,
} from '../entities/relationships/LearningMaterialHasPrerequisiteLearningGoal';
import {
  LearningMaterialHasPrerequisiteTopic,
  LearningMaterialHasPrerequisiteTopicLabel,
} from '../entities/relationships/LearningMaterialHasPrerequisiteTopic';
import {
  LearningMaterialLeadsToLearningGoal,
  LearningMaterialLeadsToLearningGoalLabel,
} from '../entities/relationships/LearningMaterialLeadsToLearningGoal';
import {
  LearningMaterialShowedInTopic,
  LearningMaterialShowedInTopicLabel,
} from '../entities/relationships/LearningMaterialShowedInTopic';
import { UserCreatedLearningMaterialLabel } from '../entities/relationships/UserCreatedLearningMaterial';
import {
  UserRatedLearningMaterial,
  UserRatedLearningMaterialLabel,
} from '../entities/relationships/UserRatedLearningMaterial';
import { Topic, TopicLabel } from '../entities/Topic';
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
  getRelatedNode,
} from './util/abstract_graph_repo';
import { generateGetRatingMethod, generateRateEntityMethod } from './util/rating';

export const findLearningMaterial = (learningMaterialId: string) =>
  findOne<LearningMaterial, { _id: string }>({ label: LearningMaterialLabel })({ _id: learningMaterialId });

export const rateLearningMaterial = generateRateEntityMethod<LearningMaterial, UserRatedLearningMaterial>(
  LearningMaterialLabel,
  UserRatedLearningMaterialLabel
);

export const getLearningMaterialRating = generateGetRatingMethod(LearningMaterialLabel, UserRatedLearningMaterialLabel);

export const showLearningMaterialInTopics = (
  learningMaterialId: string,
  topicsIds: string[]
): Promise<{ learningMaterial: LearningMaterial; topics: Topic[] }> =>
  attachNodes<LearningMaterial, LearningMaterialShowedInTopic, Topic>({
    originNode: { label: LearningMaterialLabel, filter: { _id: learningMaterialId } },
    relationship: { label: LearningGoalShowedInTopicLabel },
    destinationNode: { label: TopicLabel, filter: { _id: { $in: topicsIds } } },
  }).then(items => {
    if (items.length !== topicsIds.length)
      logger.warn('showLearningMaterialInTopics: some topics in ' + JSON.stringify(topicsIds) + ' not found');
    if (!items.length) throw new NotFoundError('LearningMaterial', learningMaterialId); // TODO: fix, because right it throws this error when no topics are passed
    return {
      learningMaterial: items[0].originNode,
      topics: items.map(({ destinationNode }) => destinationNode),
    };
  });

export const hideLearningMaterialFromTopics = (
  learningMaterialId: string,
  topicsIds: string[]
): Promise<{ learningMaterial: LearningMaterial; topics: Topic[] }> =>
  detachNodes<LearningMaterial, LearningMaterialShowedInTopic, Topic>({
    originNode: {
      label: LearningMaterialLabel,
      filter: { _id: learningMaterialId },
    },
    relationship: {
      label: LearningGoalShowedInTopicLabel,
      filter: {},
    },
    destinationNode: {
      label: TopicLabel,
      filter: { _id: { $in: topicsIds } },
    },
  }).then(items => {
    if (items.length !== topicsIds.length)
      logger.warn('hideLearningMaterialFromTopics: some topics in ' + JSON.stringify(topicsIds) + ' not found');
    if (!items.length) throw new NotFoundError('LearningMaterial', learningMaterialId);
    return {
      learningMaterial: items[0].originNode,
      topics: items.map(({ destinationNode }) => destinationNode),
    };
  });

export const getLearningMaterialTopicsShowedIn = (learningMaterialId: string): Promise<Topic[]> =>
  getRelatedNodes<LearningMaterial, LearningMaterialShowedInTopic, Topic>({
    originNode: {
      label: LearningMaterialLabel,
      filter: { _id: learningMaterialId },
    },
    relationship: {
      label: LearningMaterialShowedInTopicLabel,
    },
    destinationNode: {
      label: TopicLabel,
    },
  }).then(map(prop('destinationNode')));

export const attachLearningMaterialCoversTopics = (
  learningMaterialId: string,
  topicsIds: string[],
  props: { userId: string }
): Promise<{ learningMaterial: LearningMaterial; topics: Topic[] }> =>
  attachNodes<LearningMaterial, LearningMaterialCoversTopic, Topic>({
    originNode: { label: LearningMaterialLabel, filter: { _id: learningMaterialId } },
    relationship: {
      label: LearningMaterialCoversTopicLabel,
      onCreateProps: { createdAt: Date.now(), createdByUserId: props.userId },
    },
    destinationNode: { label: TopicLabel, filter: { _id: { $in: topicsIds } } },
  }).then(items => {
    if (items.length !== topicsIds.length)
      logger.warn('attachLearningMaterialCoversTopics: some topics in ' + JSON.stringify(topicsIds) + ' not found');
    if (!items.length) throw new NotFoundError('LearningMaterial', learningMaterialId); // TODO: fix, because right it throws this error when no topics are passed
    return {
      learningMaterial: items[0].originNode,
      topics: items.map(({ destinationNode }) => destinationNode),
    };
  });

export const detachLearningMaterialCoversTopics = (
  learningMaterialId: string,
  topicsIds: string[]
): Promise<{ learningMaterial: LearningMaterial; topics: Topic[] }> =>
  detachNodes<LearningMaterial, LearningMaterialCoversTopic, Topic>({
    originNode: {
      label: LearningMaterialLabel,
      filter: { _id: learningMaterialId },
    },
    relationship: {
      label: LearningMaterialCoversTopicLabel,
      filter: {},
    },
    destinationNode: {
      label: TopicLabel,
      filter: { _id: { $in: topicsIds } },
    },
  }).then(items => {
    if (items.length !== topicsIds.length)
      logger.warn('detachLearningMaterialCoversTopics: some topics in ' + JSON.stringify(topicsIds) + ' not found');
    if (!items.length) throw new NotFoundError('LearningMaterial', learningMaterialId);
    return {
      learningMaterial: items[0].originNode,
      topics: items.map(({ destinationNode }) => destinationNode),
    };
  });

export const getLearningMaterialCoveredTopics = (
  _id: string
): Promise<{ learningMaterial: LearningMaterial; relationship: LearningMaterialCoversTopic; topic: Topic }[]> =>
  getRelatedNodes<LearningMaterial, LearningMaterialCoversTopic, Topic>({
    originNode: {
      label: LearningMaterialLabel,
      filter: { _id },
    },
    relationship: {
      label: LearningMaterialCoversTopicLabel,
    },
    destinationNode: {
      label: TopicLabel,
    },
  }).then(items =>
    items.map(({ originNode, relationship, destinationNode }) => ({
      learningMaterial: originNode,
      relationship,
      topic: destinationNode,
    }))
  );

// TODO: optimize by attaching several learning goals to an lm in one query
export const attachLearningMaterialHasPrerequisiteTopic = async (
  learningMaterialId: string,
  prerequisiteTopicId: string,
  data: Omit<LearningMaterialHasPrerequisiteTopic, 'createdAt'>
): Promise<{ learningMaterial: LearningMaterial; relationship: LearningMaterialHasPrerequisiteTopic; topic: Topic }> =>
  attachUniqueNodes<LearningMaterial, LearningMaterialHasPrerequisiteTopic, Topic>({
    originNode: {
      label: LearningMaterialLabel,
      filter: { _id: learningMaterialId },
    },
    relationship: {
      label: LearningMaterialHasPrerequisiteTopicLabel,
      onCreateProps: {
        ...data,
        createdAt: Date.now(),
      },
    },
    destinationNode: {
      label: TopicLabel,
      filter: { _id: prerequisiteTopicId },
    },
  }).then(({ destinationNode, relationship, originNode }) => ({
    learningMaterial: originNode,
    relationship,
    topic: destinationNode,
  }));

export const detachLearningMaterialHasPrerequisiteTopic = (
  learningMaterialId: string,
  prerequisiteTopicId: string
): Promise<{ learningMaterial: LearningMaterial; topic: Topic }> =>
  detachUniqueNodes<LearningMaterial, LearningMaterialHasPrerequisiteTopic, Topic>({
    originNode: {
      label: LearningMaterialLabel,
      filter: { _id: learningMaterialId },
    },
    relationship: {
      label: LearningMaterialHasPrerequisiteTopicLabel,
      filter: {},
    },
    destinationNode: {
      label: TopicLabel,
      filter: { _id: prerequisiteTopicId },
    },
  }).then(({ originNode, destinationNode }) => ({ learningMaterial: originNode, topic: destinationNode }));

// TODO: optimize by attaching several learning goals to an lm in one query
// export const attachLearningMaterialLeadsToLearningGoal = async (
//   learningMaterialId: string,
//   learningGoalId: string,
//   data: Omit<LearningMaterialLeadsToLearningGoal, 'createdAt'>
// ): Promise<{ learningMaterial: LearningMaterial; learningGoal: LearningGoal }> =>
//   attachUniqueNodes<LearningMaterial, LearningMaterialLeadsToLearningGoal, LearningGoal>({
//     originNode: {
//       label: LearningMaterialLabel,
//       filter: { _id: learningMaterialId },
//     },
//     relationship: {
//       label: LearningMaterialLeadsToLearningGoalLabel,
//       onCreateProps: {
//         ...data,
//         createdAt: Date.now(),
//       },
//     },
//     destinationNode: {
//       label: LearningGoalLabel,
//       filter: { _id: learningGoalId },
//     },
//   }).then(({ destinationNode, originNode }) => ({ learningMaterial: originNode, learningGoal: destinationNode }));

// export const detachLearningMaterialLeadsToLearningGoal = (
//   learningMaterialId: string,
//   learningGoalId: string
// ): Promise<{ learningMaterial: LearningMaterial; learningGoal: LearningGoal }> =>
//   detachUniqueNodes<LearningMaterial, LearningMaterialLeadsToLearningGoal, LearningGoal>({
//     originNode: {
//       label: LearningMaterialLabel,
//       filter: { _id: learningMaterialId },
//     },
//     relationship: {
//       label: LearningMaterialLeadsToLearningGoalLabel,
//       filter: {},
//     },
//     destinationNode: {
//       label: LearningGoalLabel,
//       filter: { _id: learningGoalId },
//     },
//   }).then(({ originNode, destinationNode }) => ({ learningMaterial: originNode, learningGoal: destinationNode }));

export const getLearningMaterialPrerequisites = (
  learningMaterialId: string
): Promise<{
  learningMaterial: LearningMaterial;
  relationship: LearningMaterialHasPrerequisiteTopic;
  topic: Topic;
}[]> =>
  getRelatedNodes<LearningMaterial, LearningMaterialHasPrerequisiteTopic, Topic>({
    originNode: {
      label: LearningMaterialLabel,
      filter: { _id: learningMaterialId },
    },
    relationship: {
      label: LearningMaterialHasPrerequisiteTopicLabel,
    },
    destinationNode: {
      label: TopicLabel,
      // filter: { hidden: false },
    },
  }).then(items =>
    items.map(({ destinationNode, relationship, originNode }) => ({
      learningMaterial: originNode,
      relationship,
      topic: destinationNode,
    }))
  );

// export const getLearningMaterialOutcomes = (
//   learningMaterialId: string
// ): Promise<{ learningGoal: LearningGoal; relationship: LearningMaterialLeadsToLearningGoal }[]> =>
//   getRelatedNodes<LearningMaterial, LearningMaterialLeadsToLearningGoal, LearningGoal>({
//     originNode: {
//       label: LearningMaterialLabel,
//       filter: { _id: learningMaterialId },
//     },
//     relationship: {
//       label: LearningMaterialLeadsToLearningGoalLabel,
//     },
//     destinationNode: {
//       label: LearningGoalLabel,
//       filter: { hidden: false },
//     },
//   }).then(items => items.map(({ destinationNode, relationship }) => ({ relationship, learningGoal: destinationNode })));

export const getLearningMaterialCreator = (learningMaterialFilter: { _id: string }) =>
  getRelatedNode<User>({
    originNode: {
      label: LearningMaterialLabel,
      filter: learningMaterialFilter,
    },
    relationship: {
      label: UserCreatedLearningMaterialLabel,
      filter: {},
    },
    destinationNode: {
      label: UserLabel,
      filter: {},
    },
  });
