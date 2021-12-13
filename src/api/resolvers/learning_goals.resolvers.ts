import { UserInputError } from 'apollo-server-koa';
import { LearningGoal, LearningGoalLabel } from '../../entities/LearningGoal';
import { NotFoundError } from '../../errors/NotFoundError';
import {
  attachLearningGoalDependsOnLearningGoal,
  attachLearningGoalRequiresSubGoal,
  attachUserStartedLearningGoal,
  countLearningGoalStartedBy,
  createLearningGoal,
  deleteLearningGoal,
  detachLearningGoalDependsOnLearningGoal,
  detachLearningGoalRequiresSubGoal,
  findLearningGoal,
  findLearningGoalCreatedBy,
  getLearningGoalCreator,
  getLearningGoalDependants,
  getLearningGoalDependencies,
  getLearningGoalProgress,
  getLearningGoalRating,
  getLearningGoalRelevantLearningMaterials,
  getLearningGoalRequiredInGoals,
  getLearningGoalRequiredSubGoals,
  getLearningGoalStartedBy,
  getLearningGoalTopicsShowedIn,
  getUserStartedLearningGoal,
  hideLearningGoalFromTopic,
  publishLearningGoal,
  rateLearningGoal,
  searchLearningGoals,
  showLearningGoalInTopic,
  updateLearningGoal,
} from '../../repositories/learning_goals.repository';
import { JWTPayload } from '../../services/auth/jwt';
import { UnauthenticatedError, UnauthorizedError } from '../errors/UnauthenticatedError';
import { APILearningGoalResolvers, APIMutationResolvers, APIQueryResolvers, UserRole } from '../schema/types';
import { restrictAccess } from '../util/auth';
import { nullToUndefined } from '../util/nullToUndefined';

const canUpdateLearningGoal = async (learningGoalId: string, user: JWTPayload): Promise<boolean> => {
  if (user.role === UserRole.ADMIN) return true;

  const learningGoal = await findLearningGoalCreatedBy(user._id, { _id: learningGoalId });
  return !!learningGoal;
};

const findLearningGoalIfAuthorized = async (
  learningGoalFilter: { _id: string } | { key: string },
  operation: 'READ' | 'UPDATE',
  user?: JWTPayload
): Promise<LearningGoal> => {
  const learningGoal = await findLearningGoal(learningGoalFilter);

  if (!learningGoal) throw new NotFoundError('LearningGoal', JSON.stringify(learningGoalFilter));

  if (operation === 'READ') {
    if (!learningGoal.publishedAt) {
      if (!user || !(await canUpdateLearningGoal(learningGoal._id, user)))
        throw new NotFoundError('LearningGoal', JSON.stringify(learningGoalFilter));
    }
    return learningGoal;
  } else {
    if (!user || !(await canUpdateLearningGoal(learningGoal._id, user)))
      throw new UnauthorizedError('You can not update this learning goal');
    return learningGoal;
  }
};

export const searchLearningGoalsResolver: APIQueryResolvers['searchLearningGoals'] = async (
  _,
  { options: { query, pagination } }
) => {
  return {
    items: await searchLearningGoals(nullToUndefined({ query }), nullToUndefined(pagination)),
  };
};

export const getLearningGoalByKeyResolver: APIQueryResolvers['getLearningGoalByKey'] = async (_, { key }, { user }) => {
  const learningGoal = await findLearningGoalIfAuthorized({ key }, 'READ', user);
  if (!learningGoal) throw new NotFoundError('LearningGoal', key, 'key');
  return learningGoal;
};

export const checkLearningGoalKeyAvailabilityResolver: APIQueryResolvers['checkLearningGoalKeyAvailability'] = async (
  _,
  { key }
) => {
  let existingLearningGoal = await findLearningGoal({ key });
  return {
    available: !existingLearningGoal,
    existingLearningGoal,
  };
};

export const createLearningGoalResolver: APIMutationResolvers['createLearningGoal'] = async (
  _parent,
  { payload, options },
  { user }
) => {
  restrictAccess('loggedInUser', user, 'Must be logged in to create a learning goal');
  if (user!.role === UserRole.USER && !!payload.key)
    throw new UserInputError('can not set the key if not an admin or contributor');
  const createdLearningGoal = await createLearningGoal(
    { _id: user!._id },
    { ...nullToUndefined(payload), publishedAt: options?.public ? Date.now() : undefined, hidden: !options?.public }
  );
  if (options?.topicId) {
    await showLearningGoalInTopic(createdLearningGoal._id, options.topicId, {});
  }
  return createdLearningGoal;
};

export const updateLearningGoalResolver: APIMutationResolvers['updateLearningGoal'] = async (
  _,
  { _id, payload },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in');
  if (user.role === UserRole.USER && !!payload.key)
    throw new UserInputError('can not set the key if not an admin or contributor');
  await findLearningGoalIfAuthorized({ _id }, 'UPDATE', user);

  const updatedLearningGoal = await updateLearningGoal(
    { _id },
    { ...nullToUndefined(payload), description: payload.description }
  );
  if (!updatedLearningGoal) throw new Error('updateLearningGoalResolver: Should never happen');
  return updatedLearningGoal;
};

export const showLearningGoalInTopicResolver: APIMutationResolvers['showLearningGoalInTopic'] = async (
  _,
  { topicId, learningGoalId, payload },
  { user }
) => {
  await findLearningGoalIfAuthorized({ _id: learningGoalId }, 'UPDATE', user);
  return await showLearningGoalInTopic(learningGoalId, topicId, {
    index: payload.index || undefined,
  });
};

export const hideLearningGoalFromTopicResolver: APIMutationResolvers['hideLearningGoalFromTopic'] = async (
  _,
  { topicId, learningGoalId },
  { user }
) => {
  await findLearningGoalIfAuthorized({ _id: learningGoalId }, 'UPDATE', user);
  return await hideLearningGoalFromTopic(learningGoalId, topicId);
};

export const deleteLearningGoalResolver: APIMutationResolvers['deleteLearningGoal'] = async (
  _parent,
  { _id },
  { user }
) => {
  await findLearningGoalIfAuthorized({ _id }, 'UPDATE', user);
  const { deletedCount } = await deleteLearningGoal({ _id });
  if (!deletedCount) throw new NotFoundError('LearningGoal', _id, 'id');
  return { _id, success: true };
};

export const attachLearningGoalRequiresSubGoalResolver: APIMutationResolvers['attachLearningGoalRequiresSubGoal'] = async (
  _,
  { subGoalId, learningGoalId, payload },
  { user }
) => {
  await findLearningGoalIfAuthorized({ _id: learningGoalId }, 'UPDATE', user);
  return await attachLearningGoalRequiresSubGoal(learningGoalId, subGoalId, {
    strength: payload.strength || 100,
  });
};
export const detachLearningGoalRequiresSubGoalResolver: APIMutationResolvers['detachLearningGoalRequiresSubGoal'] = async (
  _,
  { subGoalId, learningGoalId },
  { user }
) => {
  await findLearningGoalIfAuthorized({ _id: learningGoalId }, 'UPDATE', user);
  const dependencies = await getLearningGoalDependencies(subGoalId, [learningGoalId]);
  const dependants = await getLearningGoalDependants(subGoalId, [learningGoalId]);
  await Promise.all(
    dependencies.map(({ learningGoalDependency }) =>
      detachLearningGoalDependsOnLearningGoal(subGoalId, learningGoalDependency._id)
    )
  );
  await Promise.all(
    dependants.map(({ dependantLearningGoal }) =>
      detachLearningGoalDependsOnLearningGoal(dependantLearningGoal._id, subGoalId)
    )
  );
  return await detachLearningGoalRequiresSubGoal(learningGoalId, subGoalId);
};

export const attachLearningGoalDependencyResolver: APIMutationResolvers['attachLearningGoalDependency'] = async (
  _,
  { parentLearningGoalId, learningGoalId, learningGoalDependencyId },
  { user }
) => {
  const parentLearningGoal = await findLearningGoalIfAuthorized({ _id: parentLearningGoalId }, 'UPDATE', user);
  return {
    ...(await attachLearningGoalDependsOnLearningGoal(learningGoalId, learningGoalDependencyId, {
      parentLearningGoalId,
    })),
    parentLearningGoal,
  };
};

export const detachLearningGoalDependencyResolver: APIMutationResolvers['detachLearningGoalDependency'] = async (
  _,
  { parentLearningGoalId, learningGoalId, learningGoalDependencyId },
  { user }
) => {
  const parentLearningGoal = await findLearningGoalIfAuthorized({ _id: parentLearningGoalId }, 'UPDATE', user);
  return {
    ...(await detachLearningGoalDependsOnLearningGoal(learningGoalId, learningGoalDependencyId)),
    parentLearningGoal,
  };
};

export const startLearningGoalResolver: APIMutationResolvers['startLearningGoal'] = async (
  _,
  { learningGoalId },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in');
  const { user: currentUser, learningGoal } = await attachUserStartedLearningGoal(user._id, learningGoalId, {
    startedAt: Date.now(),
  });
  return { learningGoal, currentUser };
};

export const publishLearningGoalResolver: APIMutationResolvers['publishLearningGoal'] = async (
  _,
  { learningGoalId },
  { user }
) => {
  await findLearningGoalIfAuthorized({ _id: learningGoalId }, 'UPDATE', user);
  const { learningGoal } = await publishLearningGoal(learningGoalId);
  return { learningGoal };
};

export const indexLearningGoalResolver: APIMutationResolvers['indexLearningGoal'] = async (
  _,
  { learningGoalId },
  { user }
) => {
  await findLearningGoalIfAuthorized({ _id: learningGoalId }, 'UPDATE', user);
  const learningGoal = await updateLearningGoal({ _id: learningGoalId }, { hidden: false });
  if (!learningGoal) throw new NotFoundError(LearningGoalLabel, learningGoalId);
  return { learningGoal };
};

export const rateLearningGoalResolver: APIMutationResolvers['rateLearningGoal'] = async (
  _parent,
  { learningGoalId, value },
  { user }
) => {
  restrictAccess('loggedInUser', user, 'Must be logged in to rate a learning goal'); // TODO maybe restrict to users having completed the resource ?
  if (value < 0 || value > 5) throw new UserInputError('Ratings must be >=0 and <=5');
  return await rateLearningGoal(user!._id, learningGoalId, value);
};

export const getLearningGoalShowedInResolver: APILearningGoalResolvers['showedIn'] = async learningGoal => {
  return await getLearningGoalTopicsShowedIn(learningGoal._id);
};

export const getLearningGoalRequiredSubGoalsResolver: APILearningGoalResolvers['requiredSubGoals'] = async learningGoal => {
  const results = await getLearningGoalRequiredSubGoals(learningGoal._id);
  return results.map(({ relationship, subGoal }) => ({
    subGoal,
    ...relationship,
  }));
};

export const getLearningGoalRequiredInGoalsResolver: APILearningGoalResolvers['requiredInGoals'] = async learningGoal => {
  const results = await getLearningGoalRequiredInGoals(learningGoal._id);
  return results.map(({ relationship, parentGoal }) => ({
    goal: parentGoal,
    ...relationship,
  }));
};

export const getLearningGoalCreatedByResolver: APILearningGoalResolvers['createdBy'] = async learningGoal => {
  return await getLearningGoalCreator(learningGoal._id);
};

export const getLearningGoalStartedResolver: APILearningGoalResolvers['started'] = async (
  learningGoal,
  _,
  { user }
) => {
  if (!user) return null;
  return await getUserStartedLearningGoal(user._id, learningGoal._id);
};

export const getLearningGoalStartedByResolver: APILearningGoalResolvers['startedBy'] = async (
  learningGoal,
  { options }
) => {
  return {
    count: await countLearningGoalStartedBy(learningGoal._id),
    items: (await getLearningGoalStartedBy(learningGoal._id, nullToUndefined(options))).map(
      ({ user, relationship }) => ({
        user,
        ...relationship,
      })
    ),
  };
};

export const getLearningGoalProgressResolver: APILearningGoalResolvers['progress'] = async (
  learningGoal,
  _,
  { user }
) => {
  if (!user) return null;
  return { level: await getLearningGoalProgress(learningGoal._id, user._id) };
};

export const getLearningGoalRelevantLearningMaterialsResolver: APILearningGoalResolvers['relevantLearningMaterials'] = async (
  learningGoal,
  { options },
  { user }
) => {
  const items = await getLearningGoalRelevantLearningMaterials(learningGoal._id);
  return {
    items,
    count: items.length,
  };
};

export const getLearningGoalDependsOnLearningGoalsResolver: APILearningGoalResolvers['dependsOnLearningGoals'] = async (
  learningGoal,
  { parentLearningGoalIdIn }
) => {
  const results = await getLearningGoalDependencies(learningGoal._id, parentLearningGoalIdIn || undefined);
  return results.map(({ relationship, learningGoalDependency }) => ({
    learningGoal: learningGoalDependency,
    ...relationship,
  }));
};

export const getLearningGoalDependantsLearningGoalsResolver: APILearningGoalResolvers['dependantLearningGoals'] = async (
  learningGoal,
  { parentLearningGoalIdIn }
) => {
  const results = await getLearningGoalDependants(learningGoal._id, parentLearningGoalIdIn || undefined);
  return results.map(({ relationship, dependantLearningGoal }) => ({
    learningGoal: dependantLearningGoal,
    ...relationship,
  }));
};

export const getLearningGoalRatingResolver: APILearningGoalResolvers['rating'] = learningGoal =>
  getLearningGoalRating(learningGoal._id);
