import { sign, verify } from 'jsonwebtoken';
import { User } from '../../repositories/users.repository';

const JWT_SECRET = 'SECRET';

export interface JWTPayload {
  _id: string;
  email: string;
}

export async function getJWT(user: User): Promise<string> {
  const jwtPayload: JWTPayload = {
    _id: user._id.toString(),
    email: user.email,
  };
  return new Promise((resolve, reject) => {
    sign(jwtPayload, JWT_SECRET, undefined, (err, token) => {
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
