export const errorMiddleware = (error, req, res, next) => {
  res.status(error.statusCode).json({
    error: error,
    errorMessage: error.message,
    errorCode: error.errorCode,
  });
};
