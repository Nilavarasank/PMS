const { body, param, query } = require('express-validator');
const validate = require('../middleware/validate.middleware');

const PROJECT_STATUSES = ['Not Started', 'In Progress', 'Completed'];
const SORT_FIELDS = ['name', 'status', 'start_date', 'end_date', 'created_at'];

function datesInOrder(endDate, { req }) {
  const startDate = req.body.startDate;
  if (!startDate || !endDate) return true;
  return new Date(endDate) >= new Date(startDate);
}

const projectIdParam = [
  param('id').isUUID().withMessage('Project id must be a valid UUID'),
  validate,
];

const listProjectRules = [
  query('search').optional({ values: 'falsy' }).isString().trim().isLength({ max: 255 }),
  query('status')
    .optional({ values: 'falsy' })
    .isIn(PROJECT_STATUSES)
    .withMessage('Status must be one of: Not Started, In Progress, Completed'),
  query('page').optional({ values: 'falsy' }).isInt({ min: 1 }).withMessage('page must be a positive integer'),
  query('limit').optional({ values: 'falsy' }).isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100'),
  query('sortBy').optional({ values: 'falsy' }).isIn(SORT_FIELDS).withMessage('Invalid sortBy field'),
  query('order').optional({ values: 'falsy' }).isIn(['asc', 'desc']).withMessage('order must be asc or desc'),
  validate,
];

const createProjectRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Project name is required')
    .isLength({ max: 255 })
    .withMessage('Project name must be 255 characters or fewer'),
  body('description').optional({ values: 'falsy' }).isString().trim(),
  body('status')
    .optional({ values: 'falsy' })
    .isIn(PROJECT_STATUSES)
    .withMessage('Status must be one of: Not Started, In Progress, Completed'),
  body('startDate')
    .optional({ values: 'falsy' })
    .isISO8601()
    .withMessage('startDate must be a valid date'),
  body('endDate')
    .optional({ values: 'falsy' })
    .isISO8601()
    .withMessage('endDate must be a valid date')
    .custom(datesInOrder)
    .withMessage('endDate must be on or after startDate'),
  validate,
];

const updateProjectRules = [
  param('id').isUUID().withMessage('Project id must be a valid UUID'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Project name is required')
    .isLength({ max: 255 })
    .withMessage('Project name must be 255 characters or fewer'),
  body('description').optional({ values: 'falsy' }).isString().trim(),
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(PROJECT_STATUSES)
    .withMessage('Status must be one of: Not Started, In Progress, Completed'),
  body('startDate')
    .optional({ values: 'falsy' })
    .isISO8601()
    .withMessage('startDate must be a valid date'),
  body('endDate')
    .optional({ values: 'falsy' })
    .isISO8601()
    .withMessage('endDate must be a valid date')
    .custom(datesInOrder)
    .withMessage('endDate must be on or after startDate'),
  validate,
];

module.exports = {
  PROJECT_STATUSES,
  projectIdParam,
  listProjectRules,
  createProjectRules,
  updateProjectRules,
};
