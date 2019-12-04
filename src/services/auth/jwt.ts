import { sign, verify } from 'jsonwebtoken';
import { User } from '../../entities/User';

const JWT_SECRET = 'SECRET';

export interface JWTPayload {
  _id: string;
  key: string;
  email: string;
}

export async function getJWT(user: User): Promise<string> {
  const jwtPayload: JWTPayload = {
    _id: user._id,
    key: user.key,
    email: user.email,
  };
  return new Promise((resolve, reject) => {
    sign(jwtPayload, JWT_SECRET, {}, (err, token) => {
      if (!!err) {
        return reject(err);
      }
      resolve(token);
    });
  });
}

export async function validateAndDecodeJWT(jwtEncoded: string): Promise<JWTPayload> {
  return new Promise((resolve, reject) => {
    verify(jwtEncoded, JWT_SECRET, undefined, (err, decoded: JWTPayload) => {
      if (!!err) {
        reject(err);
      }
      return resolve(decoded);
    });
  });
}
