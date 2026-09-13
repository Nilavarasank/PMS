require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const { hashPassword } = require('../utils/hashPassword');
const db = require('../config/db');
const logger = require('../utils/logger');

async function seed() {
  const email = 'ada@example.com';
  const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);

  let userId = existing.rows[0]?.id;
  if (!userId) {
    const passwordHash = await hashPassword('password123');
    const created = await db.query(
      `INSERT INTO users (full_name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id`,
      ['Ada Lovelace', email, passwordHash]
    );
    userId = created.rows[0].id;
    logger.info('Seeded user ada@example.com / password123');
  }

  const projectCheck = await db.query(
    'SELECT id FROM projects WHERE user_id = $1 AND name = $2',
    [userId, 'Website Rebuild']
  );

  let projectId = projectCheck.rows[0]?.id;
  if (!projectId) {
    const project = await db.query(
      `INSERT INTO projects (user_id, name, description, status, start_date, end_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [userId, 'Website Rebuild', 'Public site redesign', 'In Progress', '2026-01-01', '2026-03-31']
    );
    projectId = project.rows[0].id;

    await db.query(
      `INSERT INTO tasks (project_id, name, description, priority, status, due_date)
       VALUES
         ($1, 'Write spec', 'Outline pages', 'High', 'Pending', '2026-02-01'),
         ($1, 'Design homepage', 'First visual pass', 'Medium', 'In Progress', '2026-02-15')`,
      [projectId]
    );
    logger.info('Seeded project Website Rebuild with two tasks');
  } else {
    logger.info('Seed data already present');
  }
}

if (require.main === module) {
  seed()
    .then(() => db.pool.end())
    .catch(async (err) => {
      logger.error('Seed failed', { message: err.message });
      await db.pool.end();
      process.exit(1);
    });
}

module.exports = seed;
