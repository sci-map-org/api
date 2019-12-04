import { User } from '../../entities/User';
import { UserNotFoundError } from '../../errors/NotFoundError';
import { findArticlesWrittenBy } from '../../repositories/articles.repository';
import { createUser, findUserByEmail, findUserByKey } from '../../repositories/users.repository';
import { getJWT } from '../../services/auth/jwt';
import { passwordsMatch } from '../../services/auth/password_hashing';
import {
  APICurrentUser,
  APICurrentUserArticlesArgs,
  APICurrentUserResolvers,
  APIMutationResolvers,
  APIQueryResolvers,
  APIUser,
  APIUserResolvers,
} from '../schema/types';
import { nullToUndefined } from '../util/nullToUndefined';
import { toAPIArticle } from './articles.resolvers';

class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid credentials');
  }
}

export function toAPIUser(user: User): APIUser {
  return {
    ...user,
    _id: user._id.toString(),
  };
}

function toAPICurrentUser(user: User): APICurrentUser {
  return {
    ...user,
    _id: user._id.toString(),
  };
}

export const loginResolver: APIMutationResolvers['login'] = async (_parent, { email, password }, ctx) => {
  try {
    const user = await findUserByEmail(email);
    if (!user) throw new UserNotFoundError(email, 'email');

    // throw unauthorized if pwd doesn't match
    if (!(await passwordsMatch(user.password_hash, password))) {
      throw new Error();
    }
    return {
      currentUser: toAPICurrentUser(user),
      jwt: await getJWT(user),
    };
  } catch (err) {
    throw new InvalidCredentialsError();
  }
};

export const registerResolver: APIMutationResolvers['register'] = async (_parent, { payload }, ctx) => {
  return toAPICurrentUser(await createUser(payload));
};

export const currentUserResolver: APIQueryResolvers['currentUser'] = async (_parent, _payload, { user }) => {
  if (!user) throw new Error();
  const foundUser = await findUserByEmail(user.email);
  if (!foundUser) throw new Error('User logged in but no user found. This should never happen');
  return toAPICurrentUser(foundUser);
};

export const getWrittenArticlesResolver = async (
  user: APIUser | APICurrentUser,
  payload: APICurrentUserArticlesArgs
) => {
  const articles = await findArticlesWrittenBy(
    { _id: user._id },
    payload.options.pagination ? nullToUndefined(payload.options.pagination) : undefined
  );

  return { items: articles.map(toAPIArticle) };
};

export const getUserWrittenArticlesResolver: APIUserResolvers['articles'] = getWrittenArticlesResolver;

export const getCurrentUserWrittenArticlesResolver: APICurrentUserResolvers['articles'] = getWrittenArticlesResolver;

export const getUserResolver: APIQueryResolvers['getUser'] = async (_parent, { key }) => {
  const foundUser = await findUserByKey(key);
  if (!foundUser) throw new Error('User not found');
  return toAPIUser(foundUser);
};
