"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = require("bcryptjs");
exports.encryptPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcryptjs_1.genSalt(10, function (err, salt) {
            if (!!err)
                return reject(err);
            bcryptjs_1.hash(password, salt, function (err, hash) {
                if (!!err)
                    return reject(err);
                resolve(hash);
            });
        });
    });
};
exports.passwordsMatch = (encryptedPassword, passwordToCheck) => {
    return bcryptjs_1.compare(passwordToCheck, encryptedPassword);
};
//# sourceMappingURL=password_hashing.js.map