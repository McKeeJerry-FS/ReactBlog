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
