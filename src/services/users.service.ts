import fetch from 'cross-fetch';
import { User, UserRole } from '../entities/User';
import { env } from '../env';
import { createUser, findUser, updateUser } from '../repositories/users.repository';
import { identifyGoogleIdToken } from './auth/google_sign_in';
import { createEmailVerificationToken, verifyAndDecodeEmailVerificationToken } from './auth/jwt';
import { encryptPassword } from './auth/password_hashing';
import { sendDiscordNotification } from './discord/discord_webhooks.service';
import { sendEmail } from './email/email.client';
import { EmailTemplateName, generateHtmlFromTemplate } from './email/mjml.service';

// Access stuff
const accessRuleMapping: {
  [key in RoleAccessAllowedRule]: (user?: Pick<User, 'role'>) => boolean;
} = {
  all: () => true,
  loggedInUser: (user) => !!user,
  notLoggedInUser: (user) => !user,
  admin: (user) => !!user && user.role === UserRole.ADMIN,
  contributorOrAdmin: (user) => !!user && (user.role === UserRole.CONTRIBUTOR || user.role === UserRole.ADMIN),
};

export const hasAccess = (accessRule: RoleAccessAllowedRule, user?: Pick<User, 'role'>): boolean => {
  return accessRuleMapping[accessRule](user);
};

// registration
export const registerUser = async ({
  key,
  displayName,
  email,
  password,
  subscribeToNewsletter: shouldSubscribeToNewsletter,
}: {
  key: string;
  displayName: string;
  email: string;
  password: string;
  subscribeToNewsletter: boolean;
}): Promise<User> => {
  const user = await createUser({
    key,
    active: false,
    displayName,
    email,
    password_hash: await encryptPassword(password),
    role: UserRole.USER,
    subscribedToNewsletterAt: shouldSubscribeToNewsletter ? Date.now() : undefined,
  });
  await sendEmailVerificationEmail(user, Date.now());
  await completeRegistration(user, { shouldSubscribeToNewsletter });
  return user;
};

export const registerUserGoogleAuth = async ({
  key,
  displayName,
  idToken,
  subscribeToNewsletter: shouldSubscribeToNewsletter,
}: {
  key: string;
  displayName: string;
  idToken: string;
  subscribeToNewsletter: boolean;
}): Promise<User> => {
  const { googleUserId, email } = await identifyGoogleIdToken(idToken);
  const user = await createUser({
    key,
    active: true,
    displayName,
    email,
    googleUserId,
    role: UserRole.USER,
    subscribedToNewsletterAt: shouldSubscribeToNewsletter ? Date.now() : undefined,
  });
  completeRegistration(user, { shouldSubscribeToNewsletter });
  sendWelcomeEmail(user);
  return user;
};

async function completeRegistration(
  user: User,
  { shouldSubscribeToNewsletter }: { shouldSubscribeToNewsletter?: boolean }
) {
  if (!!shouldSubscribeToNewsletter) await subscribeToNewsletter(user);
  sendNewUserDiscordNotification(user);
}

export type RoleAccessAllowedRule = 'all' | 'loggedInUser' | 'admin' | 'notLoggedInUser' | 'contributorOrAdmin';

function sendNewUserDiscordNotification(user: User) {
  sendDiscordNotification(
    `OMGGGG !!! Like, we have a new user: ${user.displayName} (${user.email}, @${user.key}). I literally can't even !`
  );
}

if (env.OTHER.NODE_ENV === 'production' && !env.EMAIL.MAILERLITE_API_TOKEN)
  throw new Error('EMAIL_MAILERLITE_API_TOKEN env var required in production');

async function subscribeToNewsletter(user: User) {
  if (!env.EMAIL.MAILERLITE_API_TOKEN) {
    console.log('No env var EMAIL_MAILERLITE_API_TOKEN: skipping subscribing to newsletter');
    return;
  }
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'X-MailerLite-ApiDocs': 'true',
      'Content-Type': 'application/json',
      'X-MailerLite-ApiKey': env.EMAIL.MAILERLITE_API_TOKEN,
    },
    body: JSON.stringify({ email: user.email, name: user.displayName, type: 'active' }),
  };

  try {
    await fetch('https://api.mailerlite.com/api/v2/subscribers', options);
    return;
  } catch (err) {
    console.error(`Failed to suscribe user ${user.email} to newsletter`);
    console.error(err);
  }
}

async function sendEmailVerificationEmail(user: User, timestamp: number): Promise<void> {
  const token: string = await createEmailVerificationToken(user, timestamp);

  const verifyEmailHtml = generateHtmlFromTemplate(EmailTemplateName.VERIFY_EMAIL, {
    user,
    frontendBaseUrl: env.OTHER.FRONTEND_BASE_URL,
    token,
  });
  await sendEmail({
    from: 'Mapedia.org <no_reply@mapedia.org>',
    to: user.email,
    subject: 'Please verify your email address',
    html: verifyEmailHtml,
  });
}

export const sendWelcomeEmail = async (user: User): Promise<void> => {
  const welcomeMailHtml = generateHtmlFromTemplate(EmailTemplateName.WELCOME, {
    user,
    frontendBaseUrl: env.OTHER.FRONTEND_BASE_URL,
    discordInviteLink: env.OTHER.DISCORD_INVITE_LINK,
  });

  await sendEmail({
    from: 'Mapedia.org <community@mapedia.org>',
    to: user.email,
    subject: 'Welcome to Mapedia.org',
    html: welcomeMailHtml,
  });
};

// reset
export const sendResetPasswordEmail = async (user: User, timestamp: number): Promise<void> => {
  const token: string = await createEmailVerificationToken(user, timestamp);

  const resetPasswordMailHtml = generateHtmlFromTemplate(EmailTemplateName.RESET_PASSWORD, {
    user,
    frontendBaseUrl: env.OTHER.FRONTEND_BASE_URL,
    token,
  });

  await sendEmail({
    from: 'Mapedia.org <no_reply@mapedia.org>',
    to: user.email,
    subject: 'Password Reset',
    html: resetPasswordMailHtml,
  });
};

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
