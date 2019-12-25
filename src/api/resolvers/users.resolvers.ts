import { User, UserRole } from '../../entities/User';
import { NotFoundError, UserNotFoundError } from '../../errors/NotFoundError';
import { findArticlesCreatedBy } from '../../repositories/articles.repository';
import { createUser, findUser, updateUser } from '../../repositories/users.repository';
import { getJWT } from '../../services/auth/jwt';
import { passwordsMatch } from '../../services/auth/password_hashing';
import { UnauthorizedError } from '../errors/UnauthenticatedError';
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
    const user = await findUser({ email });
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
  const foundUser = await findUser({ email: user.email });
  if (!foundUser) throw new Error('User logged in but no user found. This should never happen');
  return toAPICurrentUser(foundUser);
};

export const getCreatedArticlesResolver = async (
  user: APIUser | APICurrentUser,
  payload: APICurrentUserArticlesArgs
) => {
  const articles = await findArticlesCreatedBy(
    { _id: user._id },
    payload.options.pagination ? nullToUndefined(payload.options.pagination) : undefined
  );

  return { items: articles.map(toAPIArticle) };
};

export const getUserCreatedArticlesResolver: APIUserResolvers['articles'] = getCreatedArticlesResolver;

export const getCurrentUserCreatedArticlesResolver: APICurrentUserResolvers['articles'] = getCreatedArticlesResolver;

export const getUserResolver: APIQueryResolvers['getUser'] = async (_parent, { key }) => {
  const foundUser = await findUser({ key });
  if (!foundUser) throw new Error('User not found');
  return toAPIUser(foundUser);
};

export const adminUpdateUserResolver: APIMutationResolvers['adminUpdateUser'] = async (
  _parent,
  { id, payload },
  { user }
) => {
  if (!user || user.role !== UserRole.ADMIN) {
    throw new UnauthorizedError();
  }
  const updatedUser = await updateUser({ _id: id }, nullToUndefined(payload));
  if (!updatedUser) throw new NotFoundError('User', id);
  return toAPIUser(updatedUser);
};
