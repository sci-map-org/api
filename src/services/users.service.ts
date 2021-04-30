import { User, UserRole } from '../entities/User';
import { env } from '../env';
import { createUser, findUser, updateUser } from '../repositories/users.repository';
import { identifyGoogleIdToken } from './auth/google_sign_in';
import { createEmailVerificationToken, verifyAndDecodeEmailVerificationToken } from './auth/jwt';
import { encryptPassword } from './auth/password_hashing';
import { sendDiscordNotification } from './discord/discord_webhooks.service';
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
  sendNewUserDiscordNotification(user);
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
  const user = await createUser({
    key,
    active: true,
    displayName,
    email,
    googleUserId,
    role: UserRole.USER,
  });
  sendNewUserDiscordNotification(user);
  return user;
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

function sendNewUserDiscordNotification(user: User) {
  sendDiscordNotification(
    `OMGGGG !!! Like, we have a new user: ${user.displayName} (${user.email}, @${user.key}). I literally can't even !`
  );
}

export const resetUserPassword = async (token: string, newPassword: string): Promise<User> => {
  const { email, timestamp } = await verifyAndDecodeEmailVerificationToken(token);

  if (timestamp + 1000 * 60 * 60 < Date.now()) {
    throw new Error('Token not valid anymore ¯_(ツ)_/¯');
  }
  const user = await findUser({ email });
  if (!user) throw new Error(`User with email: "${email}" (from token) not found`);
  await updateUser({ _id: user._id }, { password_hash: await encryptPassword(newPassword) });
  return user;
};

export const sendResetPasswordEmail = async (user: User, timestamp: number): Promise<void> => {
  const token: string = await createEmailVerificationToken(user, timestamp);
  await sendEmail({
    from: 'Sci-map.org <no_reply@sci-map.org>',
    to: user.email,
    subject: 'Password Reset',
    html: `<p>Hello ${user.displayName},</p><p>Click here to reset your password: ${env.OTHER.FRONTEND_BASE_URL}/reset_pwd?token=${token}</p>`,
  });
};
