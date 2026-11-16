
# Task CRUD API

REST API built using Node.js, Express, TypeScript and Zod.

## Technologies

- Node.js
- Express
- TypeScript
- Zod

## Installation

npm install

## Development

npm run dev

## Build

npm run build

## Production

npm start

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /health | Health check |
| POST | /api/tasks | Create task |
| GET | /api/tasks | Get all tasks |
| GET | /api/tasks/:id | Get task by ID |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |

## Task Status

- PENDING
- IN_PROGRESS
- COMPLETED

## Storage

Currently uses in-memory storage.
Data resets when the server restarts.
