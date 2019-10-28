"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./api/server");
process.on('unhandledRejection', (reason, promise) => {
    console.log('unhandledRejection');
    console.error(reason);
});
process.on('uncaughtException', reason => {
    console.log('uncaughtException');
    console.error(reason);
});
server_1.app.listen(8000);
console.log('Server running on http://localhost:8000');
//# sourceMappingURL=index.js.map