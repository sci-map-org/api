"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const graphql_server_1 = require("./api/graphql_server");
process.on('unhandledRejection', (reason, promise) => {
    console.log('unhandledRejection');
    console.error(reason);
});
process.on('uncaughtException', reason => {
    console.log('uncaughtException');
    console.error(reason);
});
const app = new Koa();
graphql_server_1.server.applyMiddleware({ app });
app.listen(8000);
console.log('Server running on http://localhost:8000');
//# sourceMappingURL=server.js.map