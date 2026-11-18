
import type { RequestHandler } from "express";
import { taskService } from "../services/task.service.js";
import type {
    CreateTaskInput,
    UpdateTaskInput,
    TaskStatus
} from "../schemas/task.schema.js";
import type {
    TaskQuery
} from "../repositories/task.repository.js";
import { AppError } from "../middleware/error.middleware.js";

const validStatuses: TaskStatus[] = [
    "PENDING",
    "IN_PROGRESS",
    "COMPLETED"
];

const validSortFields = [
    "id",
    "title",
    "status",
    "createdAt"
] as const;

export const getAllTasks: RequestHandler = async (req, res) => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const search = String(req.query.search ?? "").trim();

    const statusValue = req.query.status
        ? String(req.query.status)
        : undefined;

    const sortByValue = String(req.query.sortBy ?? "id");
    const sortOrderValue = String(req.query.sortOrder ?? "desc");

    if (!Number.isInteger(page) || page < 1) {
        throw new AppError(400, "Page must be a positive integer");
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
        throw new AppError(400, "Limit must be between 1 and 100");
    }

    if (
        statusValue &&
        !validStatuses.includes(statusValue as TaskStatus)
    ) {
        throw new AppError(400, "Invalid task status");
    }

    if (!validSortFields.includes(sortByValue as typeof validSortFields[number])) {
        throw new AppError(400, "Invalid sort field");
    }

    if (!["asc", "desc"].includes(sortOrderValue)) {
        throw new AppError(400, "Sort order must be asc or desc");
    }

    const query: TaskQuery = {
        page,
        limit,
        search,
        status: statusValue as TaskStatus | undefined,
        sortBy: sortByValue as TaskQuery["sortBy"],
        sortOrder: sortOrderValue as TaskQuery["sortOrder"]
    };

    const result = await taskService.getAllTasks(query);

    res.status(200).json({
        success: true,
        data: result.tasks,
        pagination: {
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages
        }
    });
};

export const getTaskById: RequestHandler = async (req, res) => {
    const id = Number(req.params.id);
    const task = await taskService.getTaskById(id);

    res.status(200).json({ success: true, data: task });
};

export const createTask: RequestHandler = async (req, res) => {
    const task = await taskService.createTask(
        req.body as CreateTaskInput
    );

    res.status(201).json({
        success: true,
        message: "Task created successfully",
        data: task
    });
};

export const updateTask: RequestHandler = async (req, res) => {
    const id = Number(req.params.id);
    const task = await taskService.updateTask(
        id,
        req.body as UpdateTaskInput
    );

    res.status(200).json({
        success: true,
        message: "Task updated successfully",
        data: task
    });
};

export const deleteTask: RequestHandler = async (req, res) => {
    const id = Number(req.params.id);
    await taskService.deleteTask(id);

    res.status(200).json({
        success: true,
        message: "Task deleted successfully"
    });
};
