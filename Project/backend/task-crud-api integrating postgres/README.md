# Task CRUD API – PostgreSQL Integration

## 1. Overview

Integrated PostgreSQL with the existing Express and TypeScript Task CRUD API. Replaced the in-memory array with a PostgreSQL database to store task records permanently.

## 2. Technologies Used

- Node.js
- Express.js
- TypeScript
- PostgreSQL 17
- pg (node-postgres)
- Docker
- Zod

## 3. Project Architecture

The application follows a layered architecture:

```text
Client
  |
Routes
  |
Middleware
  |
Controller
  |
Service
  |
Repository
  |
PostgreSQL Database
```

- **Routes:** Define API endpoints.
- **Middleware:** Validate incoming requests.
- **Controller:** Handle HTTP requests and responses.
- **Service:** Implement business logic.
- **Repository:** Execute database queries.
- **Database:** Store task records in PostgreSQL.

## 4. Database Design

Database: `taskdb`

Table: `tasks`

| Column | Data Type | Description |
|---|---|---|
| id | INTEGER | Primary key, auto-generated |
| title | VARCHAR(100) | Task title |
| description | VARCHAR(500) | Task description |
| status | VARCHAR(20) | Task status |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

Allowed task statuses:

- PENDING
- IN_PROGRESS
- COMPLETED

## 5. API Endpoints

Base URL: `http://localhost:3000/api/tasks`

| Method | Endpoint | Operation |
|---|---|---|
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/:id` | Get task by ID |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

All five CRUD operations were tested successfully.

## 6. Database Connection

Used the `pg` package and PostgreSQL connection pool.

Connection configuration is maintained in:

`src/config/database.ts`

Environment variables are stored in `.env` rather than hardcoded in the application.

## 7. Database Seeding

Created `scripts/seed.ts` to generate 10,000 sample task records.

The script uses PostgreSQL's `generate_series()` function to insert records efficiently.

Run the seed script:

```bash
npm run seed
```

Verify the records:

```sql
SELECT COUNT(*) FROM tasks;
```

Verified result: **10,000 records**.

Note: The seed script truncates existing task records before inserting fresh sample data.

## 8. Indexing and Query Performance

Tested query performance before and after creating an index on the `title` column.

**Before indexing:**

```sql
EXPLAIN ANALYZE
SELECT *
FROM tasks
WHERE title = 'Sample Task 9999';
```

Observed execution plan: Sequential Scan (`Seq Scan`).

**Create index:**

```sql
CREATE INDEX idx_tasks_title
ON tasks(title);
```

**After indexing:**

```sql
ANALYZE tasks;

EXPLAIN ANALYZE
SELECT *
FROM tasks
WHERE title = 'Sample Task 9999';
```

Observed an index-based scan and lower execution time in the test.

### Key Learning

- Sequential Scan checks rows across the table.
- Index Scan uses an index to locate matching records.
- Indexes can improve read performance.
- Indexes require additional storage and add overhead to write operations.
- PostgreSQL's query planner decides whether an index is beneficial.

## 9. Important Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Compile TypeScript |
| `npm start` | Run compiled application |
| `npm run seed` | Insert 10,000 sample tasks |
| `npx tsc --noEmit` | Check TypeScript errors |

## 10. Conclusion

Successfully integrated PostgreSQL with the existing Task CRUD API, implemented database-backed CRUD operations, generated 10,000 sample records, and explored query optimization using indexes and `EXPLAIN ANALYZE`.

This exercise provided practical understanding of PostgreSQL connectivity, SQL queries, database persistence, seeding, and indexing.