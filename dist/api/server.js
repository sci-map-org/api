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
const apollo_server_koa_1 = require("apollo-server-koa");
const Koa = require("koa");
const schema_1 = require("../api/schema");
const jwt_1 = require("../services/auth/jwt");
const server = new apollo_server_koa_1.ApolloServer({
    schema: schema_1.schema,
    introspection: true,
    mocks: process.env.GRAPHQL_MOCK_ENABLED === 'true' && {
        Date: () => new Date(),
    },
    mockEntireSchema: true,
    context: (context) => __awaiter(void 0, void 0, void 0, function* () {
        const jwt = context.ctx.request.header.authorization;
        if (!!jwt) {
            return { user: yield jwt_1.validateAndDecodeJWT(jwt) };
        }
        return {};
    }),
});
const app = new Koa();
exports.app = app;
server.applyMiddleware({ app });
//# sourceMappingURL=server.js.map