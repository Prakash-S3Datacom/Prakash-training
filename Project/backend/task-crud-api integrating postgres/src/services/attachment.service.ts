
import { randomUUID } from "node:crypto";
import path from "node:path";
import { supabase } from "../config/supabase.js";
import { attachmentRepository } from "../repositories/attachment.repository.js";
import type { CreateAttachmentInput } from "../repositories/attachment.repository.js";
import { taskService } from "./task.service.js";
import { AppError } from "../middleware/error.middleware.js";

const bucketName = process.env.SUPABASE_BUCKET;

if (!bucketName) {
    throw new Error("SUPABASE_BUCKET environment variable is missing");
}

export const attachmentService = {
    async createAttachment(input: CreateAttachmentInput, fileBuffer: Buffer) {
        await taskService.getTaskById(input.taskId);

        const extension = path.extname(input.originalName).toLowerCase();
        const storedName = `${input.taskId}/${randomUUID()}${extension}`;

        const { error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(storedName, fileBuffer, {
                contentType: input.mimeType,
                upsert: false
            });

        if (uploadError) {
            console.error("Supabase upload failed:", uploadError.message);
            throw new AppError(500, "Unable to upload file to cloud storage");
        }

        try {
            return await attachmentRepository.create({
                ...input,
                storedName
            });
        } catch (error) {
            // Remove the uploaded object if saving metadata fails.
            await supabase.storage
                .from(bucketName)
                .remove([storedName]);

            throw error;
        }
    },

    async getAttachments(taskId: number) {
        await taskService.getTaskById(taskId);
        return attachmentRepository.findByTaskId(taskId);
    },

    async getAttachmentById(id: number) {
        const attachment = await attachmentRepository.findById(id);

        if (!attachment) {
            throw new AppError(404, "Attachment not found");
        }

        return attachment;
    },

    async getFile(id: number) {
        const attachment = await this.getAttachmentById(id);

        const { data, error } = await supabase.storage
            .from(bucketName)
            .download(attachment.stored_name);

        if (error || !data) {
            console.error("Supabase download failed:", error?.message);
            throw new AppError(404, "Attachment file not found");
        }

        return { attachment, file: data };
    },

    async deleteAttachment(id: number) {
        const attachment = await this.getAttachmentById(id);

        const { error } = await supabase.storage
            .from(bucketName)
            .remove([attachment.stored_name]);

        if (error) {
            console.error("Supabase delete failed:", error.message);
            throw new AppError(500, "Unable to delete file from cloud storage");
        }

        await attachmentRepository.delete(id);

        return true;
    }
};
