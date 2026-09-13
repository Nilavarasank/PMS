# Frontend

Vite + React UI for the Project Management System, structured as MVVM.

```
index.html              Vite entry
public/                 favicon and static assets
src/
  models/               API / data access
  viewmodels/           state and commands
  views/pages|components|layouts|routes
  core/                 shared validators
  App.jsx
  main.jsx
```

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Vite dev server (port 5173) |
| `npm run build` | Production bundle |
| `npm run preview` | Preview the bundle |
| `npm run lint` | Oxlint |

## Environment

Copy `.env.example` to `.env`:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

Vite only exposes variables prefixed with `VITE_`. Restart the dev server after changing this file.

## Auth flow

- JWT and user profile are stored in memory and `localStorage`.
- Axios attaches `Authorization: Bearer <token>` on every request.
- A `401` response clears the session and sends the browser to `/login`.
- `/dashboard`, `/projects`, and `/projects/:id` are wrapped in `ProtectedRoute`.
