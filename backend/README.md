# Backend Local Setup

## Prerequisites

- Node.js 18+
- npm
- MongoDB instance (local or remote)

## Install

```bash
npm install
```

## Configure

Set your MongoDB connection string:

```bash
export MONGO_URI='mongodb://127.0.0.1:27017/reactblog'
```

## Run

```bash
npm run dev
```

The API listens on `http://localhost:8080` by default and serves post routes under `/api/v1/posts`.

## Commitlint (without Husky)

Commitlint remains available as a manual command:

```bash
npm run commitlint
```
