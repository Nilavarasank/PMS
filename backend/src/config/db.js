const { Pool, types } = require('pg');
const logger = require('../utils/logger');

// Keep DATE columns as YYYY-MM-DD so JSON responses do not shift a day in local timezones.
types.setTypeParser(1082, (value) => value);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
  logger.error('Unexpected PostgreSQL pool error', { message: err.message });
});

async function query(text, params) {
  return pool.query(text, params);
}

module.exports = {
  pool,
  query,
};
