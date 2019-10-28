"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NotFoundError extends Error {
    constructor(entityName, value, fieldName = '_id') {
        super(`${entityName} with ${fieldName}:${value} not found`);
    }
}
exports.NotFoundError = NotFoundError;
//# sourceMappingURL=NotFoundError.js.map