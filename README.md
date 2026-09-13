# PMS — Project Management System

Full-stack app for registering, signing in, and managing **your own** projects and tasks. Every list, detail, and dashboard figure is scoped to the authenticated user.

**Live local URLs**

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000/api |
| Health check | http://localhost:5000/api/health |
| PostgreSQL | `localhost:5432` |

---

## Features

- Register, login, and logout with JWT sessions
- Create, edit, search, filter, sort, and paginate projects
- Create, edit, complete, search, filter, and paginate tasks inside a project
- Dashboard totals: projects, tasks, completed, pending, and in-progress
- Ownership checks — another user’s project or task returns `403`
- Responsive UI (phone, tablet, desktop) with a slide-out navigation drawer
- Docker Compose for Postgres + API + UI
- GitHub Actions CI (backend tests + frontend build)

---

## Tech stack

| Layer | Choices |
|-------|---------|
| Frontend | React 19, Vite, React Router, Axios |
| Backend | Node.js, Express 5, PostgreSQL, `pg` |
| Auth | JWT (`Authorization: Bearer`), bcrypt (12 rounds) |
| Validation | express-validator (API), shared client validators |
| Tests | Jest + Supertest |
| Ops | Docker Compose, GitHub Actions, Helmet, CORS, rate limit |

Both sides follow **MVVM**: models talk to data, view-models hold commands and state, views bind HTTP routes or React screens.

---

## Repository layout

```text
PMS/
├── backend/                 Express API
│   ├── src/
│   │   ├── config/          PostgreSQL pool
│   │   ├── models/          SQL access (users, projects, tasks)
│   │   ├── viewmodels/      Request / response logic
│   │   ├── views/           Route bindings
│   │   ├── middleware/      Auth, validation, errors, rate limit
│   │   ├── validators/      express-validator rules
│   │   ├── migrations/      001–003 SQL + seed
│   │   ├── utils/
│   │   ├── app.js           App factory (used by tests)
│   │   └── server.js        Process entry
│   └── tests/               Auth, project, and task route tests
├── frontend/                Vite + React UI
│   ├── index.html
│   ├── public/              Favicon only
│   └── src/
│       ├── models/          API clients
│       ├── viewmodels/      Auth + page hooks
│       ├── views/           Pages, components, layouts, routes
│       └── core/            Shared validators
├── docs/                    Setup, API reference, ER diagrams
├── .github/workflows/       CI
└── docker-compose.yml
```

---

## Prerequisites

- Node.js 22+
- npm 11+
- PostgreSQL 14+ **or** Docker

---

## Quick start (local)

### 1. Database

```sql
CREATE USER nila WITH PASSWORD 'nila';
CREATE DATABASE project_management OWNER nila;
```

### 2. Backend

```bash
cd backend
copy .env.example .env
npm install
npm run migrate
npm run seed
npm run dev
```

On macOS / Linux use `cp` instead of `copy`. Set a real `JWT_SECRET` in `backend/.env` before any shared or production use.

Seed account (created only if missing): `ada@example.com` / `password123`.

### 3. Frontend

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

Open http://localhost:5173, sign in (or register), then use **Projects** and **Dashboard**.

### 4. Docker (optional)

```bash
docker compose up --build
```

This starts Postgres, migrates on backend boot, and serves the UI on port 5173.

---

## Environment

Copy the example files. **Never commit a real `.env`.**

### Backend (`backend/.env.example`)

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `PORT` | No | `5000` | API port |
| `DATABASE_URL` | Yes | — | Postgres connection string |
| `JWT_SECRET` | Yes | — | Signs access tokens |
| `JWT_EXPIRES_IN` | No | `1h` | Token lifetime |
| `CORS_ORIGIN` | No | `http://localhost:5173` | Allowed browser origins (comma-separated). In development, any `localhost` Vite port is also allowed |
| `NODE_ENV` | No | — | `development` or `production` |

### Frontend (`frontend/.env.example`)

| Variable | Required | Purpose |
|----------|----------|---------|
| `VITE_API_BASE_URL` | Yes in production | API root including `/api`, e.g. `http://localhost:5000/api` |

---

## API overview

Base path: `/api`. Authenticated routes need `Authorization: Bearer <token>`.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/health` | No | Liveness |
| `POST` | `/auth/register` | No | Create account |
| `POST` | `/auth/login` | No | Issue JWT |
| `POST` | `/auth/logout` | Yes | Client-side session end |
| `GET` | `/projects` | Yes | List (search, status, sort, page) |
| `GET` | `/projects/:id` | Yes | Project detail |
| `POST` | `/projects` | Yes | Create |
| `PUT` | `/projects/:id` | Yes | Update |
| `DELETE` | `/projects/:id` | Yes | Delete (cascades tasks) |
| `GET` | `/tasks` | Yes | List by `projectId` |
| `GET` | `/tasks/:id` | Yes | Task detail |
| `POST` | `/tasks` | Yes | Create |
| `PUT` | `/tasks/:id` | Yes | Update |
| `DELETE` | `/tasks/:id` | Yes | Delete |
| `GET` | `/dashboard` | Yes | Aggregates for the current user |

Auth routes are rate-limited (5 requests / 10 minutes / IP). Full request and response shapes: [docs/API_Documentation.md](docs/API_Documentation.md).

---

## Frontend routes

| Path | Access |
|------|--------|
| `/login`, `/register` | Public |
| `/dashboard` | Authenticated |
| `/projects` | Authenticated |
| `/projects/:id` | Authenticated |
| `*` | 404 |

JWT and profile are kept in memory and `localStorage`. A `401` clears the session and returns to `/login`.

---

## Scripts

**Backend**

| Command | Purpose |
|---------|---------|
| `npm run dev` | Nodemon on `src/server.js` |
| `npm start` | Production start |
| `npm run migrate` | Apply SQL migrations `001`–`003` |
| `npm run seed` | Demo user, project, and tasks |
| `npm test` | Jest + Supertest |
| `npm run lint` | Syntax check |

**Frontend**

| Command | Purpose |
|---------|---------|
| `npm run dev` | Vite (port 5173) |
| `npm run build` | Production bundle |
| `npm run preview` | Preview the bundle |
| `npm run lint` | Oxlint |

```bash
cd backend && npm test && npm run lint
cd frontend && npm run lint && npm run build
```

---

## Data model

Three tables: `users` → `projects` → `tasks` (cascade on delete). Diagrams:

- [ER diagram (PNG)](docs/ER_Diagram.png)
- [ER diagram (SVG)](docs/ER_Diagram.svg)
- [Text ER diagram](docs/ER_Diagram.txt)
- Combined schema: `backend/src/migrations/schema.sql`

---

## Security

- Passwords hashed with bcrypt (12 rounds). `password_hash` is never returned
- Short-lived JWTs; secret stays on the server
- Parameterized SQL only; sort columns are allow-listed
- Ownership on every project and task mutation
- Helmet, locked CORS, Morgan, and a central error handler (no stack traces to clients)

---

## Documentation

| Doc | Contents |
|-----|----------|
| [Setup](docs/SETUP.md) | Environment, Postgres, seed, Docker, deploy notes |
| [API](docs/API_Documentation.md) | Endpoints, bodies, errors |
| [Backend](backend/README.md) | API layout and scripts |
| [Frontend](frontend/README.md) | UI layout and auth flow |

---

## Deploy notes

- **API** (Render / Railway / Fly): set `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, and `CORS_ORIGIN` to the live frontend origin
- **Database**: managed Postgres on the same platform or Supabase
- **UI** (Vercel / Netlify): set `VITE_API_BASE_URL` to `https://<your-api>/api`
