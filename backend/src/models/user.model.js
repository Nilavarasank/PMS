const db = require('../config/db');

const SAFE_COLUMNS = 'id, full_name, email, created_at';

async function findByEmail(email) {
  const result = await db.query(
    `SELECT id, full_name, email, password_hash, created_at
     FROM users
     WHERE email = $1`,
    [email]
  );
  return result.rows[0] || null;
}

async function findById(id) {
  const result = await db.query(
    `SELECT ${SAFE_COLUMNS} FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

async function create({ fullName, email, passwordHash }) {
  const result = await db.query(
    `INSERT INTO users (full_name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING ${SAFE_COLUMNS}`,
    [fullName, email, passwordHash]
  );
  return result.rows[0];
}

function toPublic(user) {
  if (!user) return null;
  return {
    id: user.id,
    fullName: user.full_name,
    email: user.email,
    createdAt: user.created_at,
  };
}

module.exports = {
  findByEmail,
  findById,
  create,
  toPublic,
};
