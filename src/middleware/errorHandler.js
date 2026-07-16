class AppError extends Error {
  constructor(message, statusCode, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || [];

  // Handle validation errors
  if (err.validationErrors) {
    statusCode = 400;
    message = 'Validation failed';
    errors = err.validationErrors;
  }

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error(`[ERROR] ${statusCode}: ${message}`, errors.length > 0 ? errors : '');
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors.length > 0 && { errors }),
  });
}

export function catchAsync(fn) {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}

export { AppError };
