const express = require('express');
const taskViewModel = require('../viewmodels/task.viewmodel');
const authMiddleware = require('../middleware/auth.middleware');
const {
  listTaskRules,
  createTaskRules,
  updateTaskRules,
  taskIdParam,
} = require('../validators/task.validator');

const router = express.Router();

router.use(authMiddleware);

router.get('/', listTaskRules, taskViewModel.list);
router.get('/:id', taskIdParam, taskViewModel.getById);
router.post('/', createTaskRules, taskViewModel.create);
router.put('/:id', updateTaskRules, taskViewModel.update);
router.delete('/:id', taskIdParam, taskViewModel.remove);

module.exports = router;
