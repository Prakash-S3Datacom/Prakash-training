
import type { RequestHandler } from "express";

import { taskService } from "../services/task.service.js";

import type {
    CreateTaskInput,
    UpdateTaskInput
} from "../schemas/task.schema.js";

export const getAllTasks: RequestHandler = (_req, res) => {
    const tasks = taskService.getAllTasks();

    res.status(200).json({
        success: true,
        data: tasks
    });
};

export const getTaskById: RequestHandler = (req, res) => {
    const id = Number(req.params.id);

    const task = taskService.getTaskById(id);

    res.status(200).json({
        success: true,
        data: task
    });
};

export const createTask: RequestHandler = (req, res) => {
    const task = taskService.createTask(
        req.body as CreateTaskInput
    );

    res.status(201).json({
        success: true,
        message: "Task created successfully",
        data: task
    });
};

export const updateTask: RequestHandler = (req, res) => {
    const id = Number(req.params.id);

    const task = taskService.updateTask(
        id,
        req.body as UpdateTaskInput
    );

    res.status(200).json({
        success: true,
        message: "Task updated successfully",
        data: task
    });
};

export const deleteTask: RequestHandler = (req, res) => {
    const id = Number(req.params.id);

    taskService.deleteTask(id);

    res.status(200).json({
        success: true,
        message: "Task deleted successfully"
    });
};
