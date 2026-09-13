# Backend

Express API for the Project Management System. CommonJS, PostgreSQL via `pg`, JWT auth.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Nodemon on `src/server.js` |
| `npm start` | Production start |
| `npm run migrate` | Apply `001`–`003` SQL files |
| `npm test` | Jest + Supertest |
| `npm run lint` | Syntax check entry files |

## Environment

Copy `.env.example` to `.env`. See [docs/SETUP.md](../docs/SETUP.md).

Required to start the server: `DATABASE_URL`, `JWT_SECRET`.

## Layout

```
src/
  config/db.js
  models/          data access
  viewmodels/      request/response logic (former controllers)
  views/           HTTP route bindings
  middleware/
  validators/
  utils/
  migrations/
  app.js
  server.js
tests/
```

`app.js` exports `createApp()` so tests can import the app without listening.

## Hardening (Phase 7)

- Auth middleware on projects, tasks, and dashboard.
- Parameterized SQL only (`$1`, `$2`, …). Sort columns are allow-listed.
- Validation on POST/PUT and on list query params (invalid enum → 400).
- Central error handler never returns stack traces or database errors.
- Morgan logs every request. Helmet and a locked CORS origin are enabled.
- Responses never include `password_hash` or `JWT_SECRET`.
