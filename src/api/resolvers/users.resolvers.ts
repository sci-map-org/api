import { User, UserRole } from '../../entities/User';
import { NotFoundError, UserNotFoundError } from '../../errors/NotFoundError';
import { findArticlesCreatedBy } from '../../repositories/articles.repository';
import { findUser, updateUser } from '../../repositories/users.repository';
import {
  DiscourseSSOInputPayload,
  generateDiscourseSSORedirectUrl,
  validateDiscourseSSO,
} from '../../services/auth/discourse_sso';
import { identifyGoogleIdToken } from '../../services/auth/google_sign_in';
import { getJWT, verifyAndDecodeEmailVerificationToken } from '../../services/auth/jwt';
import { passwordsMatch } from '../../services/auth/password_hashing';
import { registerUser, registerUserGoogleAuth } from '../../services/users.service';
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
  constructor(m?: string) {
    super('Invalid credentials' + m);
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

export const loginResolver: APIMutationResolvers['login'] = async (_parent, { email, password, discourseSSO }) => {
  try {
    let ssoPayload: DiscourseSSOInputPayload | void;
    if (discourseSSO) {
      ssoPayload = validateDiscourseSSO(discourseSSO);
    }
    const user = await findUser({ email });
    if (!user) throw new UserNotFoundError(email, 'email');
    if (!user.active) throw new InvalidCredentialsError('Please validate your email address (check your emails)');
    if (!user.password_hash) {
      throw new InvalidCredentialsError('Try an alternative authorization method');
    }
    if (!(await passwordsMatch(user.password_hash, password))) {
      throw new Error();
    }

    return {
      currentUser: toAPICurrentUser(user),
      jwt: await getJWT(user),
      ...(!!ssoPayload && { redirectUrl: generateDiscourseSSORedirectUrl(user, ssoPayload) }),
    };
  } catch (err) {
    throw new InvalidCredentialsError(err);
  }
};

export const loginGoogleResolver: APIMutationResolvers['loginGoogle'] = async (_parent, { idToken, discourseSSO }) => {
  try {
    let ssoPayload: DiscourseSSOInputPayload | void;
    if (discourseSSO) {
      ssoPayload = validateDiscourseSSO(discourseSSO);
    }
    const { email } = await identifyGoogleIdToken(idToken);
    const user = await findUser({ email });
    if (!user) throw new UserNotFoundError(email, 'email');
    return {
      currentUser: toAPICurrentUser(user),
      jwt: await getJWT(user),
      ...(!!ssoPayload && { redirectUrl: generateDiscourseSSORedirectUrl(user, ssoPayload) }),
    };
  } catch (err) {
    throw new InvalidCredentialsError(err);
  }
};

export const registerResolver: APIMutationResolvers['register'] = async (_parent, { payload }) => {
  return toAPICurrentUser(await registerUser(payload));
};

export const registerGoogleResolver: APIMutationResolvers['registerGoogle'] = async (_parent, { payload }) => {
  return toAPICurrentUser(await registerUserGoogleAuth(payload));
};

export const verifyEmailAddressResolver: APIMutationResolvers['verifyEmailAddress'] = async (_parent, { token }) => {
  const { email, timestamp } = await verifyAndDecodeEmailVerificationToken(token);

  if (timestamp + 1000 * 60 * 60 * 48 < Date.now()) {
    throw new Error('Token not valid anymore ¯_(ツ)_/¯');
  }

  const user = await updateUser({ email: email }, { active: true });

  if (!user) throw new Error('This should never happen, no users found with email in token');

  return {
    email,
  };
};

export const currentUserResolver: APIQueryResolvers['currentUser'] = async (_parent, _payload, { user }) => {
  if (!user) return null;
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
