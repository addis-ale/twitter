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
  USER_NAME_ALREADY_EXIST: 1002,
  UNPROCESSABLE_ENTITY: 1003,
  INTERNAL_ERROR: 2001,
});
