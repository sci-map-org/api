import { sign, verify } from 'jsonwebtoken';
import { User, UserRole } from '../../entities/User';
import { env } from '../../env';

export interface JWTPayload {
  _id: string;
  key: string;
  email: string;
  role: UserRole;
}

interface EmailVerificationJWTPayload {
  timestamp: number;
  email: string;
}

export async function getJWT(user: User): Promise<string> {
  const jwtPayload: JWTPayload = {
    _id: user._id,
    key: user.key,
    email: user.email,
    role: user.role,
  };
  return new Promise((resolve, reject) => {
    sign(jwtPayload, env.AUTH.JWT_SECRET, {}, (err, token) => {
      if (!!err) {
        return reject(err);
      }
      resolve(token);
    });
  });
}

export async function validateAndDecodeJWT(jwtEncoded: string): Promise<JWTPayload> {
  return new Promise((resolve, reject) => {
    verify(jwtEncoded, env.AUTH.JWT_SECRET, undefined, (err, decoded: JWTPayload) => {
      if (!!err) {
        reject(err);
      }
      return resolve(decoded);
    });
  });
}

export const createEmailVerificationToken = async (user: User, timestamp: number): Promise<string> => {
  const payload: EmailVerificationJWTPayload = {
    timestamp,
    email: user.email,
  };
  return new Promise((resolve, reject) => {
    sign(payload, env.AUTH.EMAIL_JWT_SECRET, {}, (err, token) => {
      if (!!err) {
        return reject(err);
      }
      resolve(token);
    });
  });
};

export const verifyAndDecodeEmailVerificationToken = async (
  jwtEncoded: string
): Promise<EmailVerificationJWTPayload> => {
  return new Promise((resolve, reject) => {
    verify(jwtEncoded, env.AUTH.EMAIL_JWT_SECRET, undefined, (err, decoded: EmailVerificationJWTPayload) => {
      if (!!err) {
        reject(new Error('Invalid token'));
      }
      return resolve(decoded);
    });
  });
};
