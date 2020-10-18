import {APIMutationResolvers, APILearningPath} from "../schema/types";
import {UnauthenticatedError} from "../errors/UnauthenticatedError";
import {toAPIResource} from "./resources.resolvers";
import {nullToUndefined} from "../util/nullToUndefined";
import {createLearningPath} from "../../repositories/learning_paths.repositories";
import {LearningPath} from "../../entities/LearningPath";

export const toAPILearningPath(learningPath: LearningPath): APILearningPath => learningPath;

export const createLearningPathResolver: APIMutationResolvers['createLearningPath'] = async (_parent, { payload }, { user }) => {
  if (!user) throw new UnauthenticatedError('Must be logged in to add a learning path');
  return toAPILearningPath(await createLearningPath(nullToUndefined(payload), user._id));
}
