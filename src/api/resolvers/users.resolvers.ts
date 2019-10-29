import { createUser, findUserByEmail, User } from '../../repositories/users.repository';
import { getJWT } from '../../services/auth/jwt';
import { APICurrentUser, APIMutationResolvers, APIUser, APIQueryResolvers } from '../schema/types';
import { passwordsMatch } from '../../services/auth/password_hashing';
import { UserNotFoundError } from '../../errors/NotFoundError';

class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid credentials');
  }
}

function toAPIUser(user: User): APIUser {
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
