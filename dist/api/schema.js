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
const graphql_import_1 = require("graphql-import");
const users_resolvers_1 = require("./resolvers/users.resolvers");
exports.typeDefs = graphql_import_1.importSchema('./src/api/schema/schema.graphql');
const resolvers = {
    Mutation: {
        login: users_resolvers_1.loginResolver,
        signup: users_resolvers_1.signupResolver,
    },
    Query: {
        currentUser: (a, b, { user }) => __awaiter(void 0, void 0, void 0, function* () {
            if (!!user)
                return user;
            throw new Error();
        }),
    },
};
exports.schema = apollo_server_koa_1.makeExecutableSchema({
    typeDefs: exports.typeDefs,
    resolvers,
});
//# sourceMappingURL=schema.js.map