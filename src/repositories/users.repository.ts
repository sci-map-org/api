import { omit } from 'lodash';
import shortid = require('shortid');

import { ConceptLabel, Concept } from '../entities/Concept';
import { UserConsumedResourceLabel, UserConsumedResource } from '../entities/relationships/UserConsumedResource';
import { UserKnowsConceptLabel, UserKnowsConcept } from '../entities/relationships/UserKnowsConcept';
import { ResourceLabel, Resource } from '../entities/Resource';
import { User, UserLabel, UserRole } from '../entities/User';
import { neo4jDriver } from '../infra/neo4j';
import { encryptPassword } from '../services/auth/password_hashing';
import { attachNodes, detachNodes, findOne, updateOne } from './util/abstract_graph_repo';
import { nullToUndefined } from '../api/util/nullToUndefined';

interface CreateUserData {
  displayName: string;
  key: string;
  email: string;
  password: string;
}

interface UpdateUserData {
  displayName?: string;
  key?: string;
  email?: string;
  role?: UserRole;
}

class NonUniqueUserEmail extends Error {
  constructor(email: string) {
    super(`Email address ${email} already in use`);
  }
}

export const createUser = async (data: CreateUserData): Promise<User> => {
  const existingUser = await findUser({ email: data.email });

  if (!!existingUser) {
    throw new NonUniqueUserEmail(data.email);
  }

  const session = neo4jDriver.session();

  const userToCreate: User = {
    ...omit(data, 'password'),
    _id: shortid.generate(),
    password_hash: await encryptPassword(data.password),
    role: UserRole.USER,
  };

  const { records } = await session.run(`CREATE (user:User $props) RETURN properties(user) as user`, {
    props: userToCreate,
  });

  session.close();

  const record = records.pop();

  if (!record) throw new Error();

  return record.get('user');
};

export const findUser = findOne<User, { key: string } | { email: string }>({ label: 'User' });

export const updateUser = updateOne<User, { _id: string }, UpdateUserData>({ label: 'User' });

export const attachUserKnowsConcepts = (
  userId: string,
  conceptsToKnow: Array<{ conceptId: string; level?: number | null }>
) =>
  Promise.all(
    conceptsToKnow.map(conceptToKnow =>
      attachNodes<User, UserKnowsConcept, Concept>({
        originNode: {
          label: UserLabel,
          filter: { _id: userId },
        },
        relationship: {
          label: UserKnowsConceptLabel,
          onCreateProps: {
            level: conceptToKnow.level || 100,
          },
        },
        destinationNode: {
          label: ConceptLabel,
          filter: { _id: conceptToKnow.conceptId }, // can't user $in cause different values based on the conceptId
        },
      })
    )
  );

export const detachUserKnowsConcepts = (userId: string, conceptIds: string[]) =>
  detachNodes({
    originNode: {
      label: UserLabel,
      filter: { _id: userId },
    },
    relationship: {
      label: UserKnowsConceptLabel,
      filter: {},
    },
    destinationNode: {
      label: ConceptLabel,
      filter: { _id: { $in: conceptIds } },
    },
  });

export const attachUserConsumedResources = (
  userId: string,
  resourcesToConsume: Array<{ resourceId: string; consumedAt?: number | null; openedAt?: number | null }>
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
