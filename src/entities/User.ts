export const UserLabel = 'User';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface User {
  _id: string;
  email: string;
  displayName: string;
  key: string;
  password_hash: string;
  role: UserRole;
}
