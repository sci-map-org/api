import { db } from '../infra/database';
import { IObjectID } from 'monk';
import { NotFoundError } from '../errors/NotFoundError';
import { encryptPassword } from '../services/auth/password_hashing';
import { omit } from 'lodash';

const userCollection = db.get<User>('users');

interface CreateUserData {
  displayName: string;
  uniqueName: string;
  email: string;
  password: string;
}

class UserNotFoundError extends NotFoundError {
  constructor(value: string, fieldName: string) {
    super('User', value, fieldName);
  }
}

class NonUniqueUserEmail extends Error {
  constructor(email: string) {
    super(`Email address ${email} already in use`);
  }
}

export interface User {
  _id: IObjectID;
  email: string;
  displayName: string;
  uniqueName: string;
  password_hash: string;
}

export const createUser = async (data: CreateUserData): Promise<User> => {
  const existingUser = await findUserByEmail(data.email);
  if (!!existingUser) {
    throw new NonUniqueUserEmail(data.email);
  }
  return userCollection.insert({
    ...omit(data, 'password'),
    password_hash: await encryptPassword(data.password),
  });
};

export const findUserByEmail = async (email: string): Promise<User> => {
  const user = await userCollection.findOne({
    email,
  });
  if (!user) {
    throw new UserNotFoundError(email, 'email');
  }
  return user;
};
