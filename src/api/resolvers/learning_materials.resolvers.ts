import { UserInputError } from "apollo-server-koa";
import { rateLearningMaterial } from "../../repositories/learning_materials.repository";
import { APILearningMaterialResolvers, APIMutationResolvers } from "../schema/types";
import { restrictAccess } from "../util/auth";

export const learningMaterialResolveType: APILearningMaterialResolvers['__resolveType'] = (obj, ctx, info) => {
    if (obj['mediaType']) {
        return 'Resource'
    }
    return 'LearningPath'
}

export const rateLearningMaterialResolver: APIMutationResolvers['rateLearningMaterial'] = async (
    _parent,
    { learningMaterialId, value },
    { user }
) => {
    restrictAccess('contributorOrAdmin', user, 'Must be logged in and an admin or a contributor to rate a learning material');
    if (value < 0 || value > 5) throw new UserInputError('Ratings must be >=0 and <=5');
    return await rateLearningMaterial(user!._id, learningMaterialId, value);
};
