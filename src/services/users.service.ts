import { User, UserRole } from '../entities/User';
import { createUser } from '../repositories/users.repository';
import { identifyGoogleIdToken } from './auth/google_sign_in';
import { encryptPassword } from './auth/password_hashing';

export const registerUser = async ({
  key,
  displayName,
  email,
  password,
}: {
  key: string;
  displayName: string;
  email: string;
  password: string;
}): Promise<User> => {
  return createUser({
    key,
    displayName,
    email,
    password_hash: await encryptPassword(password),
    role: UserRole.USER,
  });
};

export const registerUserGoogleAuth = async ({
  key,
  displayName,
  idToken,
}: {
  key: string;
  displayName: string;
  idToken: string;
}): Promise<User> => {
  const { googleUserId, email } = await identifyGoogleIdToken(idToken);
  return createUser({
    key,
    displayName,
    email,
    googleUserId,
    role: UserRole.USER,
  });
};
