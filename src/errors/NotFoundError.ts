export class NotFoundError extends Error {
  constructor(entityName: string, value: string, fieldName: string = '_id') {
    super(`${entityName} with ${fieldName}:${value} not found`);
  }
}
