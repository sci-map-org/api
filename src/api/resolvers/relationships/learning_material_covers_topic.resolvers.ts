import { attachLearningMaterialCoversTopics, detachLearningMaterialCoversTopics } from "../../../repositories/learning_materials.repository";
import { APIMutationResolvers } from "../../schema/types";
import { restrictAccess } from "../../util/auth";

export const attachLearningMaterialCoversTopicsResolver: APIMutationResolvers['attachLearningMaterialCoversTopics'] = async (_, {
        learningMaterialId, topicsIds
}, {user}) => {
        restrictAccess(
        'loggedInUser',
        user,
        'Must be logged in'
      );
      const { learningMaterial } = await attachLearningMaterialCoversTopics(
        learningMaterialId,
        topicsIds,
        {userId: user!._id}
      );
      return learningMaterial
}

export const detachLearningMaterialCoversTopicsResolver: APIMutationResolvers['detachLearningMaterialCoversTopics'] = async (_, {learningMaterialId, topicsIds}, {user}) => {
    restrictAccess(
        'loggedInUser',
        user,
        'Must be logged in'
      );
      const { learningMaterial } = await detachLearningMaterialCoversTopics(
        learningMaterialId,
        topicsIds
      );
      return learningMaterial
}