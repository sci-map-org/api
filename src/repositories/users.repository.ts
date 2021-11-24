import { omit } from 'lodash';
import { map, prop } from 'ramda';
import { nullToUndefined } from '../api/util/nullToUndefined';
import { LearningPath, LearningPathLabel } from '../entities/LearningPath';
import { UserConsumedResource, UserConsumedResourceLabel } from '../entities/relationships/UserConsumedResource';
import {
  UserCreatedLearningMaterial,
  UserCreatedLearningMaterialLabel,
} from '../entities/relationships/UserCreatedLearningMaterial';
import {
  UserStartedLearningPath,
  UserStartedLearningPathLabel,
} from '../entities/relationships/UserStartedLearningPath';
import { Resource, ResourceLabel } from '../entities/Resource';
import { User, UserLabel, UserRole } from '../entities/User';
import { neo4jDriver } from '../infra/neo4j';
import { attachNodes, detachNodes, findOne, getRelatedNodes, updateOne } from './util/abstract_graph_repo';

import shortid = require('shortid');
import {
  UserStartedLearningGoal,
  UserStartedLearningGoalLabel,
} from '../entities/relationships/UserStartedLearningGoal';
import { LearningGoal, LearningGoalLabel } from '../entities/LearningGoal';
import {
  UserCreatedLearningGoal,
  UserCreatedLearningGoalLabel,
} from '../entities/relationships/UserCreatedLearningGoal';
import { Topic, TopicLabel } from '../entities/Topic';
import { UserKnowsTopic, UserKnowsTopicLabel } from '../entities/relationships/UserKnowsTopic';

interface UpdateUserData {
  displayName?: string;
  bio?: string;
  profilePictureUrl?: string | null;
  key?: string;
  email?: string;
  role?: UserRole;
  active?: boolean;
  password_hash?: string;
}

class NonUniqueUserEmail extends Error {
  constructor(email: string) {
    super(`Email address ${email} already in use`);
  }
}

export const createUser = async (data: Omit<User, '_id'>): Promise<User> => {
  const existingUser = await findUser({ email: data.email });

  if (!!existingUser) {
    throw new NonUniqueUserEmail(data.email);
  }
  const userToCreate: User = {
    ...data,
    _id: shortid.generate(),
  };
  const session = neo4jDriver.session();

  const { records } = await session.run(`CREATE (user:User $props) RETURN properties(user) as user`, {
    props: userToCreate,
  });

  session.close();

  const record = records.pop();

  if (!record) throw new Error('Unable to create user ' + JSON.stringify(userToCreate));

  return record.get('user');
};

export const findUser = findOne<User, { key: string } | { email: string }>({ label: 'User' });

export const updateUser = updateOne<User, { _id: string } | { email: string }, UpdateUserData>({ label: 'User' });

export const attachUserKnowsTopics = (
  userId: string,
  topicsToKnow: Array<{ topicId: string; level?: number | null }>
) =>
  Promise.all(
    topicsToKnow.map(topicToKnow =>
      attachNodes<User, UserKnowsTopic, Topic>({
        originNode: {
          label: UserLabel,
          filter: { _id: userId },
        },
        relationship: {
          label: UserKnowsTopicLabel,
          onCreateProps: {
            level: topicToKnow.level || 100,
          },
        },
        destinationNode: {
          label: TopicLabel,
          filter: { _id: topicToKnow.topicId }, // can't user $in cause different values based on the conceptId
        },
      })
    )
  );

export const detachUserKnowsTopics = (userId: string, topicsIds: string[]) =>
  detachNodes<User, UserKnowsTopic, Topic>({
    originNode: {
      label: UserLabel,
      filter: { _id: userId },
    },
    relationship: {
      label: UserKnowsTopicLabel,
      filter: {},
    },
    destinationNode: {
      label: TopicLabel,
      filter: { _id: { $in: topicsIds } },
    },
  });

export const attachUserConsumedResources = (
  userId: string,
  resourcesToConsume: Array<{
    resourceId: string;
    consumedAt?: number | null;
    openedAt?: number;
    lastOpenedAt?: number;
  }>
) =>
  Promise.all(
    resourcesToConsume.map(resourceToConsume =>
      attachNodes<User, UserConsumedResource, Resource>({
        originNode: {
          label: UserLabel,
          filter: { _id: userId },
        },
        relationship: {
          label: UserConsumedResourceLabel,
          onCreateProps: {
            ...omit(nullToUndefined(resourceToConsume), 'resourceId'),
          },
          onMergeProps: {
            ...omit(resourceToConsume, 'resourceId'),
          },
        },
        destinationNode: {
          label: ResourceLabel,
          filter: { _id: resourceToConsume.resourceId },
        },
      })
    )
  );

export const getLearningPathsCreatedBy = (userId: string): Promise<LearningPath[]> =>
  getRelatedNodes<User, UserCreatedLearningMaterial, LearningPath>({
    originNode: { label: UserLabel, filter: { _id: userId } },
    relationship: { label: UserCreatedLearningMaterialLabel },
    destinationNode: { label: LearningPathLabel },
  }).then(map(prop('destinationNode')));

export const getLearningPathsStartedBy = (
  userId: string
): Promise<{ user: User; relationship: UserStartedLearningPath; learningPath: LearningPath }[]> =>
  getRelatedNodes<User, UserStartedLearningPath, LearningPath>({
    originNode: { label: UserLabel, filter: { _id: userId } },
    relationship: { label: UserStartedLearningPathLabel },
    destinationNode: { label: LearningPathLabel },
  }).then(
    map(({ originNode, relationship, destinationNode }) => ({
      user: originNode,
      relationship,
      learningPath: destinationNode,
    }))
  );
export const getLearningGoalsCreatedBy = (
  userId: string
): Promise<{ user: User; relationship: UserCreatedLearningGoal; learningGoal: LearningGoal }[]> =>
  getRelatedNodes<User, UserCreatedLearningGoal, LearningGoal>({
    originNode: { label: UserLabel, filter: { _id: userId } },
    relationship: { label: UserCreatedLearningGoalLabel },
    destinationNode: { label: LearningGoalLabel },
  }).then(
    map(({ originNode, relationship, destinationNode }) => ({
      user: originNode,
      relationship,
      learningGoal: destinationNode,
    }))
  );
export const getLearningGoalsStartedBy = (
  userId: string
): Promise<{ user: User; relationship: UserStartedLearningGoal; learningGoal: LearningGoal }[]> =>
  getRelatedNodes<User, UserStartedLearningGoal, LearningGoal>({
    originNode: { label: UserLabel, filter: { _id: userId } },
    relationship: { label: UserStartedLearningGoalLabel },
    destinationNode: { label: LearningGoalLabel },
  }).then(
    map(({ originNode, relationship, destinationNode }) => ({
      user: originNode,
      relationship,
      learningGoal: destinationNode,
    }))
  );
