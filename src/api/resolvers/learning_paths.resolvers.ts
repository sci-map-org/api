import {APIMutationResolvers, APILearningPath, APIQueryResolvers} from "../schema/types";
import {UnauthenticatedError} from "../errors/UnauthenticatedError";
import {toAPIResource} from "./resources.resolvers";
import {nullToUndefined} from "../util/nullToUndefined";
import {createLearningPath, findLearningPath} from "../../repositories/learning_paths.repository";
import {LearningPath} from "../../entities/LearningPath";
import { createFullLearningPath } from "../../services/learning_paths.service";
import { NotFoundError } from "../../errors/NotFoundError";

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