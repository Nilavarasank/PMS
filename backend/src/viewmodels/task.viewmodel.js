const taskModel = require('../models/task.model');
const projectModel = require('../models/project.model');
const AppError = require('../utils/AppError');

function paginationMeta(total, page, limit) {
  return {
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

function assertTaskOwner(task, userId) {
  if (!task) {
    throw new AppError('Task not found', 404);
  }
  if (task.user_id !== userId) {
    throw new AppError('You do not have access to this task', 403);
  }
}

async function assertProjectOwner(projectId, userId) {
  const project = await projectModel.findById(projectId);
  if (!project) {
    throw new AppError('Project not found', 404);
  }
  if (project.user_id !== userId) {
    throw new AppError('You do not have access to this project', 403);
  }
  return project;
}

async function list(req, res, next) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const { rows, total } = await taskModel.listForUser(req.user.id, {
      projectId: req.query.projectId,
      status: req.query.status,
      priority: req.query.priority,
      search: req.query.search,
      page,
      limit,
      sortBy: req.query.sortBy,
      order: req.query.order,
    });

    res.json({
      data: rows.map(taskModel.toPublic),
      ...paginationMeta(total, page, limit),
    });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const task = await taskModel.findByIdWithOwner(req.params.id);
    assertTaskOwner(task, req.user.id);
    res.json(taskModel.toPublic(task));
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    await assertProjectOwner(req.body.projectId, req.user.id);
    const task = await taskModel.create(req.body);
    res.status(201).json(taskModel.toPublic(task));
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const existing = await taskModel.findByIdWithOwner(req.params.id);
    assertTaskOwner(existing, req.user.id);
    const task = await taskModel.update(req.params.id, req.body);
    res.json(taskModel.toPublic(task));
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const existing = await taskModel.findByIdWithOwner(req.params.id);
    assertTaskOwner(existing, req.user.id);
    await taskModel.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
};
