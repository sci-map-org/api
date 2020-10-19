import { NotFoundError } from "../../errors/NotFoundError";
import { findLearningPath, getLearningPathResourceItems } from "../../repositories/learning_paths.repository";
import { createFullLearningPath } from "../../services/learning_paths.service";
import { UnauthenticatedError } from "../errors/UnauthenticatedError";
import { APILearningPathResolvers, APIMutationResolvers, APIQueryResolvers } from "../schema/types";
import { nullToUndefined } from "../util/nullToUndefined";

// export const createLearningPathResolver: APIMutationResolvers['createLearningPath'] = async (_parent, { payload }, { user }) => {
//   if (!user) throw new UnauthenticatedError('Must be logged in to add a learning path');
//   return toAPILearningPath(await createLearningPath(nullToUndefined(payload)));
// }

export const createLearningPathResolver: APIMutationResolvers['createLearningPath'] = async (_ctx, {payload}, {user}) => {
    if(!user) throw new UnauthenticatedError(`Must be logged in to create a learning path`)
    return createFullLearningPath(user._id, nullToUndefined(payload))
}

// export const putLearningPathResolver: APIMutationResolvers['putLearningPath'] = async (_ctx, {}, {user}) => {
//     return 
// }

// export const deleteLearningPathResolver: APIMutationResolvers['deleteLearningPath'] = async (_ctx, {}, {user}) => {
//     return 
// }

export const getLearningPathResolver: APIQueryResolvers['getLearningPath'] = async (_ctx, {_id}, {user}) => {
    const learningPath = await findLearningPath({_id})
    if(!learningPath) throw new NotFoundError('LearningPath', _id)
    return learningPath
}

export const getLearningPathResourceItemsResolver: APILearningPathResolvers['resourceItems'] = async (learningPath) => {
    return await getLearningPathResourceItems(learningPath._id)
}