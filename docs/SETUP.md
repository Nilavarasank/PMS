# Setup

## Environment variables

### Backend (`backend/.env.example`)

| Variable | Required | Meaning |
|----------|----------|---------|
| `PORT` | No (default `5000`) | HTTP port for the API |
| `DATABASE_URL` | Yes | PostgreSQL connection string, e.g. `postgres://nila:nila@localhost:5432/project_management` |
| `JWT_SECRET` | Yes | Secret used to sign access tokens. Use a long random string in production. |
| `JWT_EXPIRES_IN` | No (default `1h`) | Access-token lifetime (`1h`, `15m`, …) |
| `CORS_ORIGIN` | No (default `http://localhost:5173`) | Allowed browser origin(s), comma-separated. In development, any `localhost` Vite port is also allowed. In production, set this to the live frontend URL. |
| `NODE_ENV` | No | `development` or `production` (changes Morgan format) |

### Frontend (`frontend/.env.example`)

| Variable | Required | Meaning |
|----------|----------|---------|
| `VITE_API_BASE_URL` | Yes in production | Base URL of the API, including `/api`. Example: `http://localhost:5000/api` |

Never commit a real `.env` file. `.gitignore` already excludes it.

## PostgreSQL

1. Install PostgreSQL 14 or newer.
2. Create a role and database:

```sql
CREATE USER nila WITH PASSWORD 'nila';
CREATE DATABASE project_management OWNER nila;
```

3. From `backend/`:

```bash
copy .env.example .env
npm install
npm run migrate
```

The migrator applies:

- `src/migrations/001_create_users.sql`
- `src/migrations/002_create_projects.sql`
- `src/migrations/003_create_tasks.sql`

`schema.sql` is the same schema in one file (useful for reviews or `psql -f`).

4. Confirm tables:

```bash
psql $DATABASE_URL -c "\dt"
```

You should see `users`, `projects`, and `tasks`.

## Seed / local test path

From `backend/` after migrations:

```bash
npm run seed
```

This creates `ada@example.com` / `password123`, a sample project (`Website Rebuild`), and two tasks if they do not already exist.

Or register yourself:

```bash
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"fullName\":\"Ada Lovelace\",\"email\":\"ada@example.com\",\"password\":\"password123\"}"
```

Then sign in at http://localhost:5173/login (or 5174/5175 if Vite picked another port), create a project, add tasks, mark one completed, and open `/dashboard` to confirm the aggregates.

## Docker

```bash
docker compose up --build
```

Postgres is initialized automatically. The backend container runs migrations before `server.js`. The frontend image bakes `VITE_API_BASE_URL=http://localhost:5000/api` so the browser can reach the API on the published port.

## Deploy notes

- Backend (Render / Railway / Fly): set `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, and `CORS_ORIGIN` to the live frontend origin.
- Database: managed Postgres on the same platform or Supabase.
- Frontend (Vercel / Netlify): set `VITE_API_BASE_URL` to `https://<your-api>/api`.
