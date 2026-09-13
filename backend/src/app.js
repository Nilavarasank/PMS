const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const authView = require('./views/auth.view');
const projectView = require('./views/project.view');
const taskView = require('./views/task.view');
const dashboardView = require('./views/dashboard.view');
const { notFoundHandler, errorHandler } = require('./middleware/error.middleware');

function isAllowedOrigin(origin) {
  if (!origin) return true;

  const configured = (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((value) => value.trim().replace(/\/$/, ''))
    .filter(Boolean);

  if (configured.includes(origin)) return true;
  if (/^https:\/\/([a-z0-9-]+\.)*vercel\.app$/i.test(origin)) return true;

  const isDev = process.env.NODE_ENV !== 'production';
  return isDev && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
}

function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin(origin, callback) {
        if (isAllowedOrigin(origin)) {
          callback(null, true);
          return;
        }
        callback(null, false);
      },
      credentials: true,
    })
  );
  app.use(express.json({ limit: '100kb' }));
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/auth', authView);
  app.use('/api/projects', projectView);
  app.use('/api/tasks', taskView);
  app.use('/api/dashboard', dashboardView);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
