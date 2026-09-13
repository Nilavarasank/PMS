const projectModel = require('../models/project.model');
const AppError = require('../utils/AppError');

function paginationMeta(total, page, limit) {
  return {
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

function assertOwner(project, userId) {
  if (!project) {
    throw new AppError('Project not found', 404);
  }
  if (project.user_id !== userId) {
    throw new AppError('You do not have access to this project', 403);
  }
}

async function list(req, res, next) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const { rows, total } = await projectModel.listForUser(req.user.id, {
      search: req.query.search,
      status: req.query.status,
      page,
      limit,
      sortBy: req.query.sortBy,
      order: req.query.order,
    });

    res.json({
      data: rows.map(projectModel.toPublic),
      ...paginationMeta(total, page, limit),
    });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const project = await projectModel.findById(req.params.id);
    assertOwner(project, req.user.id);
    res.json(projectModel.toPublic(project));
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const project = await projectModel.create(req.user.id, req.body);
    res.status(201).json(projectModel.toPublic(project));
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const existing = await projectModel.findById(req.params.id);
    assertOwner(existing, req.user.id);
    const project = await projectModel.update(req.params.id, req.body);
    res.json(projectModel.toPublic(project));
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const existing = await projectModel.findById(req.params.id);
    assertOwner(existing, req.user.id);
    await projectModel.remove(req.params.id);
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
