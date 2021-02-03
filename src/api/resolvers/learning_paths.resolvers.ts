import { NotFoundError } from '../../errors/NotFoundError';
import {
  getLearningMaterialCoveredConcepts,
  getLearningMaterialCoveredConceptsByDomain,
  getLearningMaterialDomains,
  getLearningMaterialRating,
} from '../../repositories/learning_materials.repository';
import { getLearningMaterialTags } from '../../repositories/learning_material_tags.repository';
import {
  attachResourceToLearningPath,
  countLearningPathStartedBy,
  detachResourceFromLearningPath,
  findLearningPath,
  findLearningPathCreatedBy,
  getLearningPathComplementaryResources,
  getLearningPathCreator,
  getLearningPathResourceItems,
  getLearningPathStartedBy,
  getUserStartedLearningPath,
  updateUserStartedLearningPath,
} from '../../repositories/learning_paths.repository';
import {
  createFullLearningPath,
  deleteFullLearningPath,
  findLearningPathIfAuthorized,
  startUserLearningPath,
  updateFullLearningPath,
} from '../../services/learning_paths.service';
import { UnauthenticatedError } from '../errors/UnauthenticatedError';
import { APILearningPathResolvers, APIMutationResolvers, APIQueryResolvers, UserRole } from '../schema/types';
import { nullToUndefined } from '../util/nullToUndefined';

export const createLearningPathResolver: APIMutationResolvers['createLearningPath'] = async (
  _ctx,
  { payload },
  { user }
) => {
  if (!user) throw new UnauthenticatedError(`Must be logged in to create a learning path`);
  return createFullLearningPath(user._id, nullToUndefined(payload));
};

export const updateLearningPathResolver: APIMutationResolvers['updateLearningPath'] = async (
  _ctx,
  { _id, payload },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in');

  const learningPath =
    user.role === UserRole.ADMIN ? await findLearningPath({ _id }) : await findLearningPathCreatedBy(user._id, { _id });
  if (!learningPath) throw new NotFoundError('LearningPath', _id);

  return await updateFullLearningPath(_id, {
    ...nullToUndefined(payload),
    durationSeconds: payload.durationSeconds,
  });
};

export const deleteLearningPathResolver: APIMutationResolvers['deleteLearningPath'] = async (
  _ctx,
  { _id },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in');
  if (user.role === UserRole.ADMIN) {
    await deleteFullLearningPath(_id);
    return {
      success: true,
      _id: _id,
    };
  }
  const learningPath = await findLearningPathCreatedBy(user._id, { _id });
  if (!learningPath) throw new NotFoundError('LearningPath', _id);

  await deleteFullLearningPath(_id);
  return {
    success: true,
    _id: learningPath._id,
  };
};

export const getLearningPathResolver: APIQueryResolvers['getLearningPath'] = async (_ctx, { _id }, { user }) => {
  const learningPath = await findLearningPathIfAuthorized({ _id }, user?._id);
  return learningPath;
};

export const getLearningPathByKeyResolver: APIQueryResolvers['getLearningPathByKey'] = async (
  _ctx,
  { key },
  { user }
) => {
  const learningPath = await findLearningPathIfAuthorized({ key }, user?._id);
  return learningPath;
};

export const addComplementaryResourceToLearningPathResolver: APIMutationResolvers['addComplementaryResourceToLearningPath'] = async (
  _ctx,
  { learningPathId, resourceId },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in');

  const learningPath =
    user.role === UserRole.ADMIN
      ? await findLearningPath({ _id: learningPathId })
      : await findLearningPathCreatedBy(user._id, { _id: learningPathId });
  if (!learningPath) throw new NotFoundError('LearningPath', learningPathId);

  return await attachResourceToLearningPath(learningPathId, resourceId);
};
export const removeComplementaryResourceFromLearningPathResolver: APIMutationResolvers['removeComplementaryResourceFromLearningPath'] = async (
  _ctx,
  { learningPathId, resourceId },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in');

  const learningPath =
    user.role === UserRole.ADMIN
      ? await findLearningPath({ _id: learningPathId })
      : await findLearningPathCreatedBy(user._id, { _id: learningPathId });
  if (!learningPath) throw new NotFoundError('LearningPath', learningPathId);

  return await detachResourceFromLearningPath(learningPathId, resourceId);
};

export const startLearningPathResolver: APIMutationResolvers['startLearningPath'] = async (
  _ctx,
  { learningPathId },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in');
  return await startUserLearningPath(user._id, learningPathId);
};

/**
 * TODO: that's somewhat of a hack, might create data inconsistencies if FE doesn't call it properly. Doing it reactively
 * is a bit to complex for now.
 */
export const completeLearningPathResolver: APIMutationResolvers['completeLearningPath'] = async (
  _ctx,
  { learningPathId, completed },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in');
  return await updateUserStartedLearningPath(user._id, learningPathId, { completedAt: completed ? Date.now() : null });
};

export const getLearningPathResourceItemsResolver: APILearningPathResolvers['resourceItems'] = async learningPath => {
  return await getLearningPathResourceItems(learningPath._id);
};

export const getLearningPathComplementaryResourcesResolver: APILearningPathResolvers['complementaryResources'] = async learningPath => {
  return await getLearningPathComplementaryResources(learningPath._id);
};

export const getLearningPathRatingResolver: APILearningPathResolvers['rating'] = learningPath =>
  getLearningMaterialRating(learningPath._id);

export const getLearningPathTagsResolver: APILearningPathResolvers['tags'] = async learningPath =>
  getLearningMaterialTags(learningPath._id);

export const getLearningPathCoveredConceptsResolver: APILearningPathResolvers['coveredConcepts'] = async learningPath => {
  return {
    items: await getLearningMaterialCoveredConcepts(learningPath._id),
  };
};

export const getLearningPathCoveredConceptsByDomainResolver: APILearningPathResolvers['coveredConceptsByDomain'] = async learningPath => {
  return await getLearningMaterialCoveredConceptsByDomain(learningPath._id);
};

export const getLearningPathDomainsResolver: APILearningPathResolvers['domains'] = async learningPath => {
  return await getLearningMaterialDomains(learningPath._id);
};

export const getLearningPathStartedResolver: APILearningPathResolvers['started'] = async (
  learningPath,
  _,
  { user }
) => {
  if (!user) return null;

  const started = await getUserStartedLearningPath(user._id, learningPath._id);
  return started;
};

export const getLearningPathCreatedByResolver: APILearningPathResolvers['createdBy'] = async learningPath => {
  return await getLearningPathCreator(learningPath._id);
};

export const getLearningPathStartedByResolver: APILearningPathResolvers['startedBy'] = async (
  learningPath,
  { options }
) => {
  return {
    count: await countLearningPathStartedBy(learningPath._id),
    items: (await getLearningPathStartedBy(learningPath._id, nullToUndefined(options))).map(
      ({ user, relationship }) => ({
        user,
        ...relationship,
      })
    ),
  };
};
