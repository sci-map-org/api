"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../infra/database");
const NotFoundError_1 = require("../errors/NotFoundError");
const password_hashing_1 = require("../services/auth/password_hashing");
const lodash_1 = require("lodash");
const userCollection = database_1.db.get('users');
class UserNotFoundError extends NotFoundError_1.NotFoundError {
    constructor(value, fieldName) {
        super('User', value, fieldName);
    }
}
class NonUniqueUserEmail extends Error {
    constructor(email) {
        super(`Email address ${email} already in use`);
    }
}
exports.createUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield exports.findUserByEmail(data.email);
    if (!!existingUser) {
        throw new NonUniqueUserEmail(data.email);
    }
    return userCollection.insert(Object.assign(Object.assign({}, lodash_1.omit(data, 'password')), { password_hash: yield password_hashing_1.encryptPassword(data.password) }));
});
exports.findUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userCollection.findOne({
        email,
    });
    if (!user) {
        throw new UserNotFoundError(email, 'email');
    }
    return user;
});
//# sourceMappingURL=users.repository.js.map