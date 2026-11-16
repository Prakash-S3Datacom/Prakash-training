
import { pool } from "../config/database.js";
import type { TaskStatus } from "../schemas/task.schema.js";

export interface Task {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    createdAt: Date;
    updatedAt: Date;
}

export interface TaskQuery {
    page: number;
    limit: number;
    search: string;
    status?: TaskStatus;
    sortBy: "id" | "title" | "status" | "createdAt";
    sortOrder: "asc" | "desc";
}

export interface TaskPageResult {
    tasks: Task[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

type TaskRow = {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    createdAt: Date;
    updatedAt: Date;
};

const returningColumns = `
    id,
    title,
    description,
    status,
    created_at AS "createdAt",
    updated_at AS "updatedAt"
`;

class TaskRepository {
    async findAll(query: TaskQuery): Promise<TaskPageResult> {
        const conditions: string[] = [];
        const values: unknown[] = [];

        if (query.search) {
            values.push(`%${query.search}%`);
            conditions.push(
                `(title ILIKE $${values.length} OR description ILIKE $${values.length})`
            );
        }

        if (query.status) {
            values.push(query.status);
            conditions.push(`status = $${values.length}`);
        }

        const whereClause = conditions.length
            ? `WHERE ${conditions.join(" AND ")}`
            : "";

        // Get the total number of matching records.
        const countResult = await pool.query<{ total: string }>(
            `SELECT COUNT(*) AS total FROM tasks ${whereClause}`,
            values
        );

        const total = Number(countResult.rows[0]?.total ?? 0);

        // Map API sort fields to trusted database column names.
        const sortColumns = {
            id: "id",
            title: "title",
            status: "status",
            createdAt: "created_at"
        };

        const sortColumn = sortColumns[query.sortBy];
        const offset = (query.page - 1) * query.limit;

        const dataValues = [...values, query.limit, offset];

        const tasksResult = await pool.query<TaskRow>(
            `SELECT ${returningColumns}
             FROM tasks
             ${whereClause}
             ORDER BY ${sortColumn} ${query.sortOrder.toUpperCase()}, id DESC
             LIMIT $${dataValues.length - 1}
             OFFSET $${dataValues.length}`,
            dataValues
        );

        return {
            tasks: tasksResult.rows,
            total,
            page: query.page,
            limit: query.limit,
            totalPages: Math.ceil(total / query.limit)
        };
    }

    async findById(id: number): Promise<Task | undefined> {
        const result = await pool.query<TaskRow>(
            `SELECT ${returningColumns}
             FROM tasks
             WHERE id = $1`,
            [id]
        );

        return result.rows[0];
    }

    async create(
        data: Omit<Task, "id" | "createdAt" | "updatedAt">
    ): Promise<Task> {
        const result = await pool.query<TaskRow>(
            `INSERT INTO tasks (title, description, status)
             VALUES ($1, $2, $3)
             RETURNING ${returningColumns}`,
            [data.title, data.description, data.status]
        );

        return result.rows[0]!;
    }

    async update(
        id: number,
        data: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>
    ): Promise<Task | undefined> {
        const fields: Record<string, string> = {
            title: "title",
            description: "description",
            status: "status"
        };

        const entries = Object.entries(data).filter(
            ([key, value]) => fields[key] && value !== undefined
        );

        if (entries.length === 0) {
            return this.findById(id);
        }

        const values: unknown[] = [id];

        const setClauses = entries.map(([key, value], index) => {
            values.push(value);
            return `${fields[key]} = $${index + 2}`;
        });

        setClauses.push("updated_at = CURRENT_TIMESTAMP");

        const result = await pool.query<TaskRow>(
            `UPDATE tasks
             SET ${setClauses.join(", ")}
             WHERE id = $1
             RETURNING ${returningColumns}`,
            values
        );

        return result.rows[0];
    }

    async delete(id: number): Promise<boolean> {
        const result = await pool.query(
            `DELETE FROM tasks WHERE id = $1`,
            [id]
        );

        return result.rowCount !== null && result.rowCount > 0;
    }
}

export const taskRepository = new TaskRepository();
