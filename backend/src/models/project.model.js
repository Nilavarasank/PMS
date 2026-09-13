const db = require('../config/db');

const SORTABLE = new Set(['name', 'status', 'start_date', 'end_date', 'created_at']);

function toPublic(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    description: row.description,
    status: row.status,
    startDate: row.start_date,
    endDate: row.end_date,
    createdAt: row.created_at,
  };
}

function escapeLike(value) {
  return value.replace(/[%_\\]/g, '\\$&');
}

async function findById(id) {
  const result = await db.query('SELECT * FROM projects WHERE id = $1', [id]);
  return result.rows[0] || null;
}

async function listForUser(userId, { search, status, page, limit, sortBy, order }) {
  const where = ['user_id = $1'];
  const params = [userId];

  if (search) {
    params.push(`%${escapeLike(search)}%`);
    where.push(`name ILIKE $${params.length} ESCAPE '\\'`);
  }

  if (status) {
    params.push(status);
    where.push(`status = $${params.length}`);
  }

  const sortColumn = SORTABLE.has(sortBy) ? sortBy : 'created_at';
  const sortOrder = order === 'asc' ? 'ASC' : 'DESC';
  const offset = (page - 1) * limit;

  params.push(limit, offset);
  const limitIdx = params.length - 1;
  const offsetIdx = params.length;

  const whereSql = where.join(' AND ');

  const list = await db.query(
    `SELECT * FROM projects
     WHERE ${whereSql}
     ORDER BY ${sortColumn} ${sortOrder}
     LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
    params
  );

  const countParams = params.slice(0, params.length - 2);
  const count = await db.query(
    `SELECT COUNT(*)::int AS total FROM projects WHERE ${whereSql}`,
    countParams
  );

  return {
    rows: list.rows,
    total: count.rows[0].total,
  };
}

async function create(userId, data) {
  const result = await db.query(
    `INSERT INTO projects (user_id, name, description, status, start_date, end_date)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      userId,
      data.name,
      data.description || null,
      data.status || 'Not Started',
      data.startDate || null,
      data.endDate || null,
    ]
  );
  return result.rows[0];
}

async function update(id, data) {
  const result = await db.query(
    `UPDATE projects
     SET name = $1,
         description = $2,
         status = $3,
         start_date = $4,
         end_date = $5
     WHERE id = $6
     RETURNING *`,
    [
      data.name,
      data.description || null,
      data.status,
      data.startDate || null,
      data.endDate || null,
      id,
    ]
  );
  return result.rows[0] || null;
}

async function remove(id) {
  await db.query('DELETE FROM projects WHERE id = $1', [id]);
}

module.exports = {
  findById,
  listForUser,
  create,
  update,
  remove,
  toPublic,
};
