import { omit } from 'lodash';
import { IObjectID } from 'monk';

import { db } from '../infra/database';
import { encryptPassword } from '../services/auth/password_hashing';

const userCollection = db.get<User>('users');

interface CreateUserData {
  displayName: string;
  key: string;
  email: string;
  password: string;
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
  key: string;
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

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const user = await userCollection.findOne({
    email,
  });
  if (!user) {
    return null;
  }
  return user;
};
