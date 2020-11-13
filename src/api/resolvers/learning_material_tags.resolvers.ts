import { APIQueryResolvers, APIMutationResolvers } from '../schema/types';
import {
  findLearningMaterialTags,
  attachTagsToLearningMaterial,
  findOrCreateLearningMaterialTag,
  detachTagsFromLearningMaterial,
} from '../../repositories/learning_material_tags.repository';
import { nullToUndefined } from '../util/nullToUndefined';
import { findLearningMaterial } from '../../repositories/learning_materials.repository';
import { NotFoundError } from '../../errors/NotFoundError';
import { UnauthenticatedError } from '../errors/UnauthenticatedError';

export const searchLearningMaterialTagsResolver: APIQueryResolvers['searchLearningMaterialTags'] = async (_parent, { options }) => {
  return await findLearningMaterialTags(options.query, nullToUndefined(options.pagination));
};

export const addTagsToLearningMaterialResolver: APIMutationResolvers['addTagsToLearningMaterial'] = async (
  _parent,
  { learningMaterialId, tags },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in to add a learningmaterial tag');
  await Promise.all(tags.map(tag => findOrCreateLearningMaterialTag(tag)));
  await attachTagsToLearningMaterial(learningMaterialId, tags);
  const learningMaterial = await findLearningMaterial(learningMaterialId);
  if (!learningMaterial) throw new NotFoundError('LearningMaterial', learningMaterialId);
  return learningMaterial;
};

export const removeTagsFromLearningMaterialResolver: APIMutationResolvers['removeTagsFromLearningMaterial'] = async (
  _parent,
  { learningMaterialId, tags },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in to remove a learning material tag');
  return await detachTagsFromLearningMaterial(learningMaterialId, tags);
};
