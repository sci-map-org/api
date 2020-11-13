import { UserInputError } from "apollo-server-koa";
import { attachLearningMaterialCoversConcepts, attachLearningMaterialToDomain, detachLearningMaterialCoversConcepts, detachLearningMaterialFromDomain, rateLearningMaterial } from "../../repositories/learning_materials.repository";
import { UnauthenticatedError } from "../errors/UnauthenticatedError";
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


export const attachLearningMaterialToDomainResolver: APIMutationResolvers['attachLearningMaterialToDomain'] = async (
    _parent,
    { domainId, learningMaterialId },
    { user }
) => {
    if (!user) throw new UnauthenticatedError('Must be logged in');
    const { learningMaterial } = await attachLearningMaterialToDomain(learningMaterialId, domainId);
    return learningMaterial;
};

export const detachLearningMaterialFromDomainResolver: APIMutationResolvers['detachLearningMaterialFromDomain'] = async (
    _parent,
    { domainId, learningMaterialId },
    { user }
) => {
    if (!user) throw new UnauthenticatedError('Must be logged in to detach a learning material from a domain');
    const { learningMaterial } = await detachLearningMaterialFromDomain(learningMaterialId, domainId);
    return learningMaterial;
};



export const attachLearningMaterialCoversConceptsResolver: APIMutationResolvers['attachLearningMaterialCoversConcepts'] = async (
    _parent,
    { learningMaterialId, conceptIds },
    { user }
) => {
    if (!user) throw new UnauthenticatedError('Must be logged in to add covered concepts to a learning material');
    const { learningMaterial } = await attachLearningMaterialCoversConcepts(learningMaterialId, conceptIds, { userId: user._id });
    return learningMaterial
};

export const detachLearningMaterialCoversConceptsResolver: APIMutationResolvers['detachLearningMaterialCoversConcepts'] = async (
    _parent,
    { learningMaterialId, conceptIds },
    { user }
) => {
    if (!user) throw new UnauthenticatedError('Must be logged in to remove covered concepts to a learning material');
    const { learningMaterial } = await detachLearningMaterialCoversConcepts(learningMaterialId, conceptIds);
    return learningMaterial
};
