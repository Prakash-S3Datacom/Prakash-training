
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
    async findAll(): Promise<Task[]> {
        const result = await pool.query<TaskRow>(
            `SELECT ${returningColumns}
             FROM tasks
             ORDER BY id ASC`
        );

        return result.rows;
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
