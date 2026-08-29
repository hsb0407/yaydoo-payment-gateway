const config = require('../config');

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'YaydooError') {
    return res.status(err.statusCode).json({
      error: err.message,
      code: 'YAYDOO_API_ERROR',
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token',
      code: 'AUTH_INVALID_TOKEN',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expired',
      code: 'AUTH_TOKEN_EXPIRED',
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: err.message,
      code: 'VALIDATION_ERROR',
    });
  }

  const statusCode = err.statusCode || 500;
  const message = config.nodeEnv === 'production' 
    ? 'Internal server error' 
    : err.message;

  res.status(statusCode).json({
    error: message,
    code: 'INTERNAL_ERROR',
  });
};

module.exports = errorHandler;
