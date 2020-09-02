import { User, UserRole } from '../entities/User';
import { env } from '../env';
import { createUser } from '../repositories/users.repository';
import { identifyGoogleIdToken } from './auth/google_sign_in';
import { createEmailVerificationToken } from './auth/jwt';
import { encryptPassword } from './auth/password_hashing';
import { sendEmail } from './email/email.client';

async function sendEmailVerificationEmail(user: User, timestamp: number): Promise<void> {
  const token: string = await createEmailVerificationToken(user, timestamp);
  await sendEmail({
    from: 'Sci-map.org <email_verification@sci-map.org>',
    to: user.email,
    subject: 'Verify your email address',
    html: `<p>Click here to verify your email address: ${env.OTHER.FRONTEND_BASE_URL}/verify_email?token=${token}</p>`,
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

export type RoleAccessAllowedRule = 'all' | 'loggedInUser' | 'admin' | 'notLoggedInUser' | 'contributorOrAdmin';

const accessRuleMapping: {
  [key in RoleAccessAllowedRule]: (user?: Pick<User, 'role'>) => boolean;
} = {
  all: () => true,
  loggedInUser: user => !!user,
  notLoggedInUser: user => !user,
  admin: user => !!user && user.role === UserRole.ADMIN,
  contributorOrAdmin: user => !!user && (user.role === UserRole.CONTRIBUTOR || user.role === UserRole.ADMIN),
};

export const hasAccess = (accessRule: RoleAccessAllowedRule, user?: Pick<User, 'role'>): boolean => {
  return accessRuleMapping[accessRule](user);
};
