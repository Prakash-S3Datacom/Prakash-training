
import type { RequestHandler } from "express";

import { taskService } from "../services/task.service.js";

import type {
    CreateTaskInput,
    UpdateTaskInput
} from "../schemas/task.schema.js";

// GET all tasks
export const getAllTasks: RequestHandler = async (_req, res) => {
    const tasks = await taskService.getAllTasks();

    res.status(200).json({
        success: true,
        data: tasks
    });
};

// GET task by ID
export const getTaskById: RequestHandler = async (req, res) => {
    const id = String(req.params.id);

    const task = await taskService.getTaskById(id);

    res.status(200).json({
        success: true,
        data: task
    });
};

// POST create task
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

// PUT update task
export const updateTask: RequestHandler = async (req, res) => {
    const id = String(req.params.id);

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

// DELETE task
export const deleteTask: RequestHandler = async (req, res) => {
    const id = String(req.params.id);

    await taskService.deleteTask(id);

    res.status(200).json({
        success: true,
        message: "Task deleted successfully"
    });
};
