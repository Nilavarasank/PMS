const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const fs = require('fs');
const { pool } = require('../config/db');
const logger = require('../utils/logger');

const FILES = [
  '001_create_users.sql',
  '002_create_projects.sql',
  '003_create_tasks.sql',
];

async function migrate() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required');
  }

  for (const file of FILES) {
    const sql = fs.readFileSync(path.join(__dirname, file), 'utf8');
    await pool.query(sql);
    logger.info(`Applied migration ${file}`);
  }
}

if (require.main === module) {
  migrate()
    .then(() => {
      logger.info('Migrations complete');
      return pool.end();
    })
    .catch(async (err) => {
      logger.error('Migration failed', { message: err.message });
      await pool.end();
      process.exit(1);
    });
}

module.exports = migrate;
