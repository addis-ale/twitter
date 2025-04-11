import { ZodError } from "zod";
import { UnprocessableEntity } from "./exceptions/unprocessableEntity.js";
import { ErrorCodes, HttpException } from "./exceptions/root.js";
import { InternalException } from "./exceptions/internalException.js";

export const errorHandler = (method) => {
  return async (req, res, next) => {
    try {
      await method(req, res, next);
    } catch (error) {
      let exception;
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path[0],
          message: err.message,
        }));
        exception = new UnprocessableEntity(
          "Validation Error",
          formattedErrors,
          ErrorCodes.UNPROCESSABLE_ENTITY
        );
      } else if (error instanceof HttpException) {
        exception = error;
      } else
        exception = new InternalException(
          "Something went wrong",
          error,
          ErrorCodes.INTERNAL_ERROR
        );
      next(exception);
    }
  };
};
