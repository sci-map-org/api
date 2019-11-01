export class UnauthenticatedError extends Error {
  constructor(message) {
    super(`Unauthenticated:${message}`);
  }
}

export class UnauthorizedError extends Error {
  constructor(message = 'You are not authorized to perform this action') {
    super(message);
  }
}
