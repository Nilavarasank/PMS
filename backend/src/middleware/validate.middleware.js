const { validationResult } = require('express-validator');

function validate(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const formatted = errors.array().map((item) => ({
    field: item.path,
    message: item.msg,
  }));

  return res.status(400).json({
    message: formatted[0]?.message || 'Validation failed',
    errors: formatted,
  });
}

module.exports = validate;
