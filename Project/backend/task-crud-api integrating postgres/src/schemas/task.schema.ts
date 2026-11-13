
import { z } from "zod";

export const taskStatusSchema = z.enum([
    "PENDING",
    "IN_PROGRESS",
    "COMPLETED"
]);

export const createTaskSchema = z.object({
    title: z.string()
        .trim()
        .min(1, "Title is required")
        .max(100, "Title must not exceed 100 characters"),

    description: z.string()
        .trim()
        .max(500, "Description must not exceed 500 characters")
        .optional(),

    status: taskStatusSchema.default("PENDING")
});

export const updateTaskSchema = z.object({
    title: z.string()
        .trim()
        .min(1, "Title is required")
        .max(100, "Title must not exceed 100 characters")
        .optional(),

    description: z.string()
        .trim()
        .max(500, "Description must not exceed 500 characters")
        .optional(),

    status: taskStatusSchema.optional()
}).refine(
    data => Object.keys(data).length > 0,
    {
        message: "At least one field must be provided"
    }
);

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskStatus = z.infer<typeof taskStatusSchema>;
