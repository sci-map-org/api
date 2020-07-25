import { User, UserRole } from '../entities/User';
import { createUser } from '../repositories/users.repository';
import { identifyGoogleIdToken } from './auth/google_sign_in';
import { encryptPassword } from './auth/password_hashing';
import { createEmailVerificationToken } from './auth/jwt';
import { sendEmail } from './email/email.client';

async function sendEmailVerificationEmail(user: User, timestamp: number): Promise<void> {
  const token: string = await createEmailVerificationToken(user, timestamp);
  await sendEmail({
    from: 'emailverification@sci-mao.org',
    to: user.email,
    subject: 'Verify your email address',
    html: `<p>Click here to verify your email address: http://sci-map.org/verify_email?token=${token}</p>`,
  });
}

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
  const user = await createUser({
    key,
    active: false,
    displayName,
    email,
    password_hash: await encryptPassword(password),
    role: UserRole.USER,
  });
  await sendEmailVerificationEmail(user, Date.now());
  return user;
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
    active: true,
    displayName,
    email,
    googleUserId,
    role: UserRole.USER,
  });
};
