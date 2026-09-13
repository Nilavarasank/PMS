const rateLimit = require('express-rate-limit');

const authRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many authentication attempts. Please try again in 10 minutes.',
  },
});

module.exports = {
  authRateLimiter,
};
