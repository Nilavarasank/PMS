const db = require('../config/db');

const SORTABLE = new Set(['name', 'priority', 'status', 'due_date', 'created_at']);

function toPublic(row) {
  if (!row) return null;
  return {
    id: row.id,
    projectId: row.project_id,
    name: row.name,
    description: row.description,
    priority: row.priority,
    status: row.status,
    dueDate: row.due_date,
    createdAt: row.created_at,
  };
}

function escapeLike(value) {
  return value.replace(/[%_\\]/g, '\\$&');
}

async function findByIdWithOwner(id) {
  const result = await db.query(
    `SELECT t.*, p.user_id
     FROM tasks t
     INNER JOIN projects p ON p.id = t.project_id
     WHERE t.id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

async function listForUser(userId, filters) {
  const { projectId, status, priority, search, page, limit, sortBy, order } = filters;
  const where = ['p.user_id = $1'];
  const params = [userId];

  if (projectId) {
    params.push(projectId);
    where.push(`t.project_id = $${params.length}`);
  }

  if (status) {
    params.push(status);
    where.push(`t.status = $${params.length}`);
  }

  if (priority) {
    params.push(priority);
    where.push(`t.priority = $${params.length}`);
  }

  if (search) {
    params.push(`%${escapeLike(search)}%`);
    where.push(`t.name ILIKE $${params.length} ESCAPE '\\'`);
  }

  const sortColumn = SORTABLE.has(sortBy) ? `t.${sortBy}` : 't.created_at';
  const sortOrder = order === 'asc' ? 'ASC' : 'DESC';
  const offset = (page - 1) * limit;

  params.push(limit, offset);
  const limitIdx = params.length - 1;
  const offsetIdx = params.length;
  const whereSql = where.join(' AND ');

  const list = await db.query(
    `SELECT t.*
     FROM tasks t
     INNER JOIN projects p ON p.id = t.project_id
     WHERE ${whereSql}
     ORDER BY ${sortColumn} ${sortOrder}
     LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
    params
  );

  const countParams = params.slice(0, params.length - 2);
  const count = await db.query(
    `SELECT COUNT(*)::int AS total
     FROM tasks t
     INNER JOIN projects p ON p.id = t.project_id
     WHERE ${whereSql}`,
    countParams
  );

  return {
    rows: list.rows,
    total: count.rows[0].total,
  };
}

async function create(data) {
  const result = await db.query(
    `INSERT INTO tasks (project_id, name, description, priority, status, due_date)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      data.projectId,
      data.name,
      data.description || null,
      data.priority || null,
      data.status || 'Pending',
      data.dueDate || null,
    ]
  );
  return result.rows[0];
}

async function update(id, data) {
  const result = await db.query(
    `UPDATE tasks
     SET name = $1,
         description = $2,
         priority = $3,
         status = $4,
         due_date = $5
     WHERE id = $6
     RETURNING *`,
    [
      data.name,
      data.description || null,
      data.priority || null,
      data.status,
      data.dueDate || null,
      id,
    ]
  );
  return result.rows[0] || null;
}

async function remove(id) {
  await db.query('DELETE FROM tasks WHERE id = $1', [id]);
}

module.exports = {
  findByIdWithOwner,
  listForUser,
  create,
  update,
  remove,
  toPublic,
};
