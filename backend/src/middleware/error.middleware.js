const logger = require('../utils/logger');

function notFoundHandler(req, res) {
  res.status(404).json({ message: 'Route not found' });
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const status = err.statusCode || err.status || 500;
  const isClientError = status >= 400 && status < 500;

  logger.error(err.message || 'Unhandled error', {
    status,
    method: req.method,
    path: req.originalUrl,
  });

  const message = isClientError
    ? err.message || 'Request failed'
    : 'Internal server error';

  res.status(status).json({ message });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
