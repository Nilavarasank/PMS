const { body, param, query } = require('express-validator');
const validate = require('../middleware/validate.middleware');

const TASK_STATUSES = ['Pending', 'In Progress', 'Completed'];
const TASK_PRIORITIES = ['Low', 'Medium', 'High'];
const SORT_FIELDS = ['name', 'priority', 'status', 'due_date', 'created_at'];

const taskIdParam = [
  param('id').isUUID().withMessage('Task id must be a valid UUID'),
  validate,
];

const listTaskRules = [
  query('projectId').optional({ values: 'falsy' }).isUUID().withMessage('projectId must be a valid UUID'),
  query('search').optional({ values: 'falsy' }).isString().trim().isLength({ max: 255 }),
  query('status')
    .optional({ values: 'falsy' })
    .isIn(TASK_STATUSES)
    .withMessage('Status must be one of: Pending, In Progress, Completed'),
  query('priority')
    .optional({ values: 'falsy' })
    .isIn(TASK_PRIORITIES)
    .withMessage('Priority must be one of: Low, Medium, High'),
  query('page').optional({ values: 'falsy' }).isInt({ min: 1 }).withMessage('page must be a positive integer'),
  query('limit').optional({ values: 'falsy' }).isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100'),
  query('sortBy').optional({ values: 'falsy' }).isIn(SORT_FIELDS).withMessage('Invalid sortBy field'),
  query('order').optional({ values: 'falsy' }).isIn(['asc', 'desc']).withMessage('order must be asc or desc'),
  validate,
];

const createTaskRules = [
  body('projectId').isUUID().withMessage('projectId must be a valid UUID'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Task name is required')
    .isLength({ max: 255 })
    .withMessage('Task name must be 255 characters or fewer'),
  body('description').optional({ values: 'falsy' }).isString().trim(),
  body('priority')
    .optional({ values: 'falsy' })
    .isIn(TASK_PRIORITIES)
    .withMessage('Priority must be one of: Low, Medium, High'),
  body('status')
    .optional({ values: 'falsy' })
    .isIn(TASK_STATUSES)
    .withMessage('Status must be one of: Pending, In Progress, Completed'),
  body('dueDate')
    .optional({ values: 'falsy' })
    .isISO8601()
    .withMessage('dueDate must be a valid date'),
  validate,
];

const updateTaskRules = [
  param('id').isUUID().withMessage('Task id must be a valid UUID'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Task name is required')
    .isLength({ max: 255 })
    .withMessage('Task name must be 255 characters or fewer'),
  body('description').optional({ values: 'falsy' }).isString().trim(),
  body('priority')
    .optional({ values: 'falsy' })
    .isIn(TASK_PRIORITIES)
    .withMessage('Priority must be one of: Low, Medium, High'),
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(TASK_STATUSES)
    .withMessage('Status must be one of: Pending, In Progress, Completed'),
  body('dueDate')
    .optional({ values: 'falsy' })
    .isISO8601()
    .withMessage('dueDate must be a valid date'),
  validate,
];

module.exports = {
  TASK_STATUSES,
  TASK_PRIORITIES,
  taskIdParam,
  listTaskRules,
  createTaskRules,
  updateTaskRules,
};
