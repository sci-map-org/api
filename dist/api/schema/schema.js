"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_import_1 = require("graphql-import");
const apollo_server_koa_1 = require("apollo-server-koa");
exports.typeDefs = graphql_import_1.importSchema('./src/schema/schema');
exports.schema = apollo_server_koa_1.makeExecutableSchema({ typeDefs: exports.typeDefs, resolvers: {} });
//# sourceMappingURL=schema.js.map