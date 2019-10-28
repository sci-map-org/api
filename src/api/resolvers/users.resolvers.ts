import { createUser, findUserByEmail, User } from '../../repositories/users.repository';
import { getJWT } from '../../services/auth/jwt';
import { APICurrentUser, APIMutationResolvers, APIUser } from '../schema/types';
import { passwordsMatch } from '../../services/auth/password_hashing';

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

export const signupResolver: APIMutationResolvers['signup'] = async (_parent, { payload }, ctx) => {
  return toAPICurrentUser(await createUser(payload));
};
