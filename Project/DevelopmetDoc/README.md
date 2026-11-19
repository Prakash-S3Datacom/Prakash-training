# Task Management Application

## 1. Project Overview

The Task Management Application is a full-stack web application that allows users to manage tasks, track progress, and upload attachments.

The application supports user authentication, role-based access, task CRUD operations, and file attachment management.

## 2. Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, TypeScript |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL (Supabase) |
| File Storage | Supabase Storage |
| Web Server | Nginx |
| Containerization | Docker, Docker Compose |
| Deployment | Render |
| Version Control | Git, GitHub |

## 3. Application Architecture

The application is deployed using separate frontend and backend services.

- **Frontend:** React application served through Nginx.
- **Backend:** Express REST API running on Node.js.
- **Database:** Supabase PostgreSQL.
- **File Storage:** Supabase Storage for task attachments.
- **Deployment:** Frontend and backend are hosted separately on Render.

### Deployed URLs

| Service | URL |
|---|---|
| Frontend | https://task-frontend-jdf0.onrender.com |
| Backend | https://task-api-9f2t.onrender.com |
| Backend Health | https://task-api-9f2t.onrender.com/health |

## 4. Local Development Setup

### Prerequisites

Install the following tools:

- Node.js 22 or later
- npm
- Git
- Docker Desktop
- Visual Studio Code

### Clone the Repository

```bash
git clone https://github.com/Prakash-S3Datacom/Prakash-training.git
cd Prakash-training/Project
```

### Start Docker Services

```bash
docker compose up -d --build
```

This starts the local application services, including the backend, frontend, and PostgreSQL database.

### Stop Docker Services

```bash
docker compose down
```

### Local Application URLs

| Service | URL |
|---|---|
| Frontend | http://localhost:8080 |
| Backend | http://localhost:3000 |
| Backend Health | http://localhost:3000/health |

## 5. Database and File Storage Configuration

The deployed application uses Supabase for:

- PostgreSQL database hosting.
- Persistent task and user data.
- Attachment file storage.

The database schema is maintained in:

`backend/task-crud-api integrating postgres/database/schema.sql`

The attachment storage bucket is:

`task-attachments`

Configure the required connection details through environment variables. Never commit `.env` files or database backups.

## 6. Deployment Process

The application is deployed on Render using two separate Docker Web Services.

### 6.1 Backend Deployment

**Service name:** `task-api`

Configuration:

| Setting | Value |
|---|---|
| Repository | Prakash-S3Datacom/Prakash-training |
| Branch | Day10 |
| Runtime | Docker |
| Root Directory | Project/backend/task-crud-api integrating postgres |
| Region | Singapore |

Backend environment variables:

| Variable | Description |
|---|---|
| NODE_ENV | production |
| PORT | Provided by Render |
| DATABASE_URL | Supabase PostgreSQL connection URI |
| JWT_SECRET | Secure JWT signing secret |
| JWT_EXPIRES_IN | JWT expiration duration |
| SUPABASE_URL | Supabase project URL |
| SUPABASE_SECRET_KEY | Supabase secret key |
| SUPABASE_BUCKET | task-attachments |

After deployment, verify the API using:

`https://task-api-9f2t.onrender.com/health`

### 6.2 Frontend Deployment

**Service name:** `task-frontend`

Configuration:

| Setting | Value |
|---|---|
| Repository | Prakash-S3Datacom/Prakash-training |
| Branch | Day10 |
| Runtime | Docker |
| Root Directory | Project/frontend/task-ui |
| Region | Singapore |

Frontend environment variable:

| Variable | Value |
|---|---|
| API_URL | https://task-api-9f2t.onrender.com |

Nginx uses this variable to forward API requests to the deployed backend.

After deployment, open:

`https://task-frontend-jdf0.onrender.com`

### 6.3 Deployment Workflow

1. Complete development and testing locally.
2. Verify frontend and backend builds.
3. Commit the changes to Git.
4. Push the changes to the `Day10` branch.
5. Render detects the new commit and triggers deployment when auto-deploy is enabled.
6. Verify backend health.
7. Open the frontend and test application functionality.

## 7. Environment Variable Security

- Never push `.env` files to GitHub.
- Never expose database passwords, JWT secrets, or Supabase secret keys.
- Configure production secrets through Render Environment Variables.
- Do not commit SQL database backups.
- Rotate credentials if they are accidentally exposed.

## 8. Deployment Limitations

The application currently uses Render Free Web Services.

- Free services may spin down after inactivity.
- The first request after inactivity may take longer because the service needs to start.
- Frontend and backend are deployed independently.
- Supabase database and storage are managed separately from Render.

## 9. Testing Checklist

- [ ] Frontend loads successfully.
- [ ] User login works.
- [ ] Admin login works.
- [ ] Task creation works.
- [ ] Task update and deletion work.
- [ ] Task listing works.
- [ ] Attachment upload works.
- [ ] Attachment download works.
- [ ] Attachment deletion works.
- [ ] Backend health endpoint responds successfully.

## 10. Development Progress — Day 10

Completed activities:

- Integrated Supabase PostgreSQL with the backend.
- Migrated existing users, tasks, and attachment metadata.
- Integrated Supabase Storage for file attachments.
- Implemented attachment upload, download, listing, and deletion.
- Updated Docker configuration for deployment.
- Configured Nginx reverse proxy for frontend-to-backend communication.
- Prepared production environment variables.
- Deployed the backend and frontend independently on Render.
- Verified successful application deployment.

**Current status:** Frontend and backend deployed successfully. Production application testing is in progress.

## 11. Repository Information

GitHub Repository:

https://github.com/Prakash-S3Datacom/Prakash-training

Development Branch:

`Day10`
