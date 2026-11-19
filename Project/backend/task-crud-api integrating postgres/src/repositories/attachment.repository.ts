
import { pool } from "../config/database.js";

export interface Attachment {
    id: number;
    task_id: number;
    original_name: string;
    stored_name: string;
    mime_type: string;
    file_size: number;
    uploaded_by: number | null;
    created_at: Date;
}

export interface CreateAttachmentInput {
    taskId: number;
    originalName: string;
    storedName: string;
    mimeType: string;
    fileSize: number;
    uploadedBy: number;
}

export const attachmentRepository = {
    async create(input: CreateAttachmentInput): Promise<Attachment> {
        const result = await pool.query<Attachment>(
            `INSERT INTO attachments
            (task_id, original_name, stored_name, mime_type, file_size, uploaded_by)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [
                input.taskId,
                input.originalName,
                input.storedName,
                input.mimeType,
                input.fileSize,
                input.uploadedBy
            ]
        );

        return result.rows[0]!;
    },

    async findByTaskId(taskId: number): Promise<Attachment[]> {
        const result = await pool.query<Attachment>(
            `SELECT * FROM attachments
             WHERE task_id = $1
             ORDER BY created_at DESC`,
            [taskId]
        );

        return result.rows;
    },

    async findById(id: number): Promise<Attachment | null> {
        const result = await pool.query<Attachment>(
            `SELECT * FROM attachments WHERE id = $1`,
            [id]
        );

        return result.rows[0] ?? null;
    },

    async delete(id: number): Promise<Attachment | null> {
        const result = await pool.query<Attachment>(
            `DELETE FROM attachments
             WHERE id = $1
             RETURNING *`,
            [id]
        );

        return result.rows[0] ?? null;
    }
};
