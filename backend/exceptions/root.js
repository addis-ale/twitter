// HttpException class
export class HttpException extends Error {
  constructor(message, statusCode, error, errorCode) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.error = error;
    this.errorCode = errorCode;
  }
}

// Error codes
export const ErrorCodes = Object.freeze({
  USER_ALREADY_EXIST: 1001,
  USER_NOT_FOUND: 1002,
  USER_NAME_ALREADY_EXIST: 1003,
  INVALID_CREDENTIAL: 1004,
  UNPROCESSABLE_ENTITY: 3003,
  INTERNAL_ERROR: 2001,
});
