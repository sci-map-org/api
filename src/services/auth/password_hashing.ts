import { genSalt, hash, compare } from 'bcryptjs';

export const encryptPassword = (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    genSalt(10, function(err, salt) {
      if (!!err) return reject(err);
      hash(password, salt, function(err, hash) {
        if (!!err) return reject(err);
        resolve(hash);
      });
    });
  });
};

export const passwordsMatch = (encryptedPassword: string, passwordToCheck: string): Promise<boolean> => {
  return compare(passwordToCheck, encryptedPassword);
};
