# API Documentation

Base URL (local): `http://localhost:5000/api`

Unless noted, JSON request bodies use camelCase. Authenticated routes require:

```
Authorization: Bearer <jwt>
```

Error shape (all failures):

```json
{ "message": "Human-readable error" }
```

Validation failures may also include:

```json
{
  "message": "Project name is required",
  "errors": [{ "field": "name", "message": "Project name is required" }]
}
```

The API never returns `password_hash`.

---

## Health

### `GET /health`

Auth: no

**200**

```json
{ "status": "ok" }
```

---

## Auth

Rate limit on register and login: **5 requests / 10 minutes / IP**.

### `POST /auth/register`

Auth: no

**Body**

| Field | Rules |
|-------|--------|
| `fullName` | required, 2–255 chars |
| `email` | required, valid email |
| `password` | required, min 8 chars |

**201**

```json
{
  "user": {
    "id": "uuid",
    "fullName": "Ada Lovelace",
    "email": "ada@example.com",
    "createdAt": "2026-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**400** invalid fields · **409** `{ "message": "Email already registered" }`

### `POST /auth/login`

Auth: no

**Body:** `email`, `password`

**200** same `{ user, token }` shape as register.

**401** `{ "message": "Invalid credentials" }`

### `POST /auth/logout`

Auth: no (stateless JWT)

**200**

```json
{
  "message": "Logged out. Discard the JWT on the client; this API is stateless and does not store sessions."
}
```

The client is responsible for deleting the token. There is no refresh-token store to clear.

---

## Projects

All project routes require a valid JWT.

List/create responses use camelCase (`startDate`, `endDate`, `createdAt`, `userId`).

### `GET /projects`

Query:

| Param | Notes |
|-------|--------|
| `search` | case-insensitive name match |
| `status` | `Not Started` \| `In Progress` \| `Completed` |
| `page` | default `1` |
| `limit` | default `10`, max `100` |
| `sortBy` | `name`, `status`, `start_date`, `end_date`, `created_at` |
| `order` | `asc` \| `desc` (default `desc`) |

Invalid `status`, `sortBy`, or `order` → **400**.

**200**

```json
{
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "name": "Website",
      "description": "Rebuild",
      "status": "In Progress",
      "startDate": "2026-01-01",
      "endDate": "2026-02-01",
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "totalPages": 1
}
```

Only the current user's projects are returned.

### `GET /projects/:id`

**200** a single project object · **404** not found · **403** belongs to another user · **400** id is not a UUID

### `POST /projects`

**Body**

| Field | Rules |
|-------|--------|
| `name` | required |
| `description` | optional |
| `status` | optional, one of the three enums, default `Not Started` |
| `startDate` | optional ISO date |
| `endDate` | optional ISO date, must be `>= startDate` |

**201** project object

### `PUT /projects/:id`

Same validation as create, but `name` and `status` are required. Owner only.

**200** project object · **403** / **404** as above

### `DELETE /projects/:id`

Owner only. Cascades to tasks.

**204** empty body

---

## Tasks

All task routes require a valid JWT. A task is reachable only if its parent project's `user_id` matches the caller.

### `GET /tasks`

Query:

| Param | Notes |
|-------|--------|
| `projectId` | UUID, optional |
| `search` | case-insensitive task name |
| `status` | `Pending` \| `In Progress` \| `Completed` |
| `priority` | `Low` \| `Medium` \| `High` |
| `page`, `limit`, `sortBy`, `order` | same pagination rules as projects; `sortBy` may be `name`, `priority`, `status`, `due_date`, `created_at` |

Filters can be combined. Invalid enum values → **400**.

**200**

```json
{
  "data": [
    {
      "id": "uuid",
      "projectId": "uuid",
      "name": "Write spec",
      "description": null,
      "priority": "High",
      "status": "Pending",
      "dueDate": "2026-03-01",
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "totalPages": 1
}
```

### `GET /tasks/:id`

**200** task object · **403** / **404** / **400**

### `POST /tasks`

**Body**

| Field | Rules |
|-------|--------|
| `projectId` | required UUID, must belong to the caller |
| `name` | required |
| `description` | optional |
| `priority` | optional enum |
| `status` | optional enum, default `Pending` |
| `dueDate` | optional ISO date |

**201** task object · **403** if the project is not yours · **404** if the project does not exist

### `PUT /tasks/:id`

`name` and `status` required. Send `status: "Completed"` to mark a task done.

**200** task object

### `DELETE /tasks/:id`

**204** empty body

---

## Dashboard

### `GET /dashboard`

Auth: yes

Aggregates are computed in SQL for `req.user.id` only.

**200**

```json
{
  "totalProjects": 3,
  "totalTasks": 12,
  "completedTasks": 4,
  "pendingTasks": 6,
  "projectsInProgress": 2
}
```

---

## Common errors

| Status | When |
|--------|------|
| 400 | Validation failed (missing fields, bad email, bad dates, invalid enums) |
| 401 | Missing/invalid JWT, or bad login |
| 403 | Authenticated but not the owner |
| 404 | Route, project, or task not found |
| 409 | Email already registered |
| 429 | Auth rate limit exceeded |
| 500 | `{ "message": "Internal server error" }` — no stack or DB detail |
