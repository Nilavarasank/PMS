const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const createApp = require('./app');
const logger = require('./utils/logger');

const required = ['DATABASE_URL', 'JWT_SECRET'];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  logger.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

const app = createApp();
const port = Number(process.env.PORT) || 5000;

app.listen(port, () => {
  logger.info(`API listening on port ${port}`);
});
