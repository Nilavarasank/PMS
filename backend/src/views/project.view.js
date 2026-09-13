const express = require('express');
const projectViewModel = require('../viewmodels/project.viewmodel');
const authMiddleware = require('../middleware/auth.middleware');
const {
  listProjectRules,
  createProjectRules,
  updateProjectRules,
  projectIdParam,
} = require('../validators/project.validator');

const router = express.Router();

router.use(authMiddleware);

router.get('/', listProjectRules, projectViewModel.list);
router.get('/:id', projectIdParam, projectViewModel.getById);
router.post('/', createProjectRules, projectViewModel.create);
router.put('/:id', updateProjectRules, projectViewModel.update);
router.delete('/:id', projectIdParam, projectViewModel.remove);

module.exports = router;
