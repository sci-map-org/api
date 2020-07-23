import * as CryptoJS from 'crypto-js';
import { UnauthenticatedError } from '../../api/errors/UnauthenticatedError';
import { User, UserRole } from '../../entities/User';
import { env } from '../../env';

interface APIDiscourseSso {
  sig: string;
  sso: string;
}

export interface DiscourseSSOInputPayload {
  nonce: string;
  returnSsoUrl: string;
}

interface DiscourseSSOOutputPayload {
  nonce: string;
  email: string;
  external_id: string;
  username: string;
  name: string;
  admin: boolean;
}

export const validateDiscourseSSO = ({ sso, sig }: APIDiscourseSso): DiscourseSSOInputPayload => {
  // validate payload
  const bytes = CryptoJS.HmacSHA256(decodeURIComponent(sso), env.AUTH.DISCOURSE_SSO_SECRET);

  if (bytes.toString(CryptoJS.enc.Hex) !== sig) {
    throw new UnauthenticatedError(`Invalid Discourse sso payload/sig`);
  }

  // decode payload
  const buff = Buffer.from(sso, 'base64');
  const text = buff.toString('ascii');

  const decodedPayload = text.split('&').reduce((obj, keyValuePair) => {
    const [key, value] = keyValuePair.split('=');
    obj[key] = value;
    return obj;
  }, {}) as { nonce: string; return_sso_url: string };

  return {
    nonce: decodedPayload.nonce,
    returnSsoUrl: decodeURIComponent(decodedPayload.return_sso_url),
  };
};

function generateOutputSSOPayload(
  { _id, email, key, displayName, role }: User,
  nonce: string
): DiscourseSSOOutputPayload {
  return {
    nonce,
    external_id: _id,
    email,
    username: key,
    name: displayName,
    admin: role === UserRole.ADMIN,
  };
}

function encodeBase64SSOPayload(payload: DiscourseSSOOutputPayload): string {
  const stringPayload = Object.keys(payload)
    .reduce((keyValuePairs, key) => {
      keyValuePairs.push(`${key}=${payload[key]}`);
      return keyValuePairs;
    }, [] as string[])
    .join('&');
  return Buffer.from(stringPayload).toString('base64');
}

export const generateDiscourseSSORedirectUrl = (user: User, ssoPayload: DiscourseSSOInputPayload): string => {
  const payload = generateOutputSSOPayload(user, ssoPayload.nonce);

  const payloadEncoded = encodeBase64SSOPayload(payload);
  const sig = CryptoJS.HmacSHA256(payloadEncoded, env.AUTH.DISCOURSE_SSO_SECRET).toString(CryptoJS.enc.Hex);
  const redirectUrl = `${ssoPayload.returnSsoUrl}?sso=${encodeURIComponent(payloadEncoded)}&sig=${sig}`;
  return redirectUrl;
};
