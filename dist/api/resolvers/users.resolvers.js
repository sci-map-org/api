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
const users_repository_1 = require("../../repositories/users.repository");
const jwt_1 = require("../../services/auth/jwt");
const password_hashing_1 = require("../../services/auth/password_hashing");
class InvalidCredentialsError extends Error {
    constructor() {
        super('Invalid credentials');
    }
}
function toAPIUser(user) {
    return Object.assign(Object.assign({}, user), { _id: user._id.toString() });
}
function toAPICurrentUser(user) {
    return Object.assign(Object.assign({}, user), { _id: user._id.toString() });
}
exports.loginResolver = (_parent, { email, password }, ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield users_repository_1.findUserByEmail(email);
        if (!(yield password_hashing_1.passwordsMatch(user.password_hash, password))) {
            throw new Error();
        }
        return {
            currentUser: toAPICurrentUser(user),
            jwt: yield jwt_1.getJWT(user),
        };
    }
    catch (err) {
        throw new InvalidCredentialsError();
    }
});
exports.signupResolver = (_parent, { payload }, ctx) => __awaiter(void 0, void 0, void 0, function* () {
    return toAPICurrentUser(yield users_repository_1.createUser(payload));
});
//# sourceMappingURL=users.resolvers.js.map