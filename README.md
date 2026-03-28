# ReactBlog Local Setup

This project runs as two local apps:

- Frontend: Vite React app (default at `http://localhost:5173`)
- Backend: Express API (default at `http://localhost:8080`)

Docker is optional and not required for local development.

## Prerequisites

- Node.js 18+
- npm
- MongoDB running locally, or a remote MongoDB URI

## Backend setup

1. Install dependencies:

```bash
cd backend
npm install
```

2. Set MongoDB connection string:

```bash
export MONGO_URI='mongodb://127.0.0.1:27017/reactblog'
```

3. Start backend:

```bash
npm run dev
```

## Frontend setup

In a second terminal from project root:

1. Install dependencies:

```bash
npm install
```

2. (Optional) Override backend URL if needed:

```bash
export VITE_BACKEND_URL='http://localhost:8080/api/v1'
```

3. Start frontend:

```bash
npm run dev
```

## Helpful scripts (root)

- `npm run dev:frontend` - start frontend
- `npm run dev:backend` - start backend from root

## Commitlint without Husky

Husky is not required in this setup. Commitlint is still available from `backend`:

```bash
cd backend
npm run commitlint
```

## Docker quickstart

Use Docker Compose from the project root:

```bash
docker compose build
docker compose up -d
```

Service URLs:

- Frontend: `http://localhost:3001`
- Backend API: `http://localhost:3000/api/v1/posts`
- MongoDB: `mongodb://localhost:27017`

Useful Docker commands:

```bash
# Show service status
docker compose ps

# Stream logs
docker compose logs -f

# Stop and remove containers/network
docker compose down

# Optional: also remove named/anonymous volumes
docker compose down -v
```
