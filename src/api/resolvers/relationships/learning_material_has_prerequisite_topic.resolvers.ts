import { attachLearningMaterialHasPrerequisiteTopic, detachLearningMaterialHasPrerequisiteTopic } from "../../../repositories/learning_materials.repository";
import { UnauthenticatedError } from "../../errors/UnauthenticatedError";
import { APIMutationResolvers } from "../../schema/types";

export const addLearningMaterialHasPrerequisiteTopicResolver: APIMutationResolvers['addLearningMaterialHasPrerequisiteTopic'] = async (
  _,
  { learningMaterialId, prerequisiteTopicId },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in');

  const { learningMaterial } = await attachLearningMaterialHasPrerequisiteTopic(
    learningMaterialId,
    prerequisiteTopicId,
    {
      strength: 100,
      createdByUserId: user._id,
    }
  );
  return learningMaterial;
};

export const removeLearningMaterialHasPrerequisiteTopicResolver: APIMutationResolvers['removeLearningMaterialHasPrerequisiteTopic'] = async (
  _,
  { learningMaterialId, prerequisiteTopicId },
  { user }
) => {
  if (!user) throw new UnauthenticatedError('Must be logged in');
  const { learningMaterial } = await detachLearningMaterialHasPrerequisiteTopic(
    learningMaterialId,
    prerequisiteTopicId
  );
  return learningMaterial;
};