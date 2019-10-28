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
const jsonwebtoken_1 = require("jsonwebtoken");
const JWT_SECRET = 'SECRET';
function getJWT(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const jwtPayload = {
            _id: user._id.toString(),
            email: user.email,
        };
        return new Promise((resolve, reject) => {
            jsonwebtoken_1.sign(jwtPayload, JWT_SECRET, undefined, (err, token) => {
                if (!!err) {
                    return reject(err);
                }
                resolve(token);
            });
        });
    });
}
exports.getJWT = getJWT;
function validateAndDecodeJWT(jwtEncoded) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            jsonwebtoken_1.verify(jwtEncoded, JWT_SECRET, undefined, (err, decoded) => {
                if (!!err) {
                    reject(err);
                }
                return resolve(decoded);
            });
        });
    });
}
exports.validateAndDecodeJWT = validateAndDecodeJWT;
//# sourceMappingURL=jwt.js.map