
import { Router } from "express";

import {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
} from "../controllers/task.controller.js";

import { validateBody } from "../middleware/validate.middleware.js";

import {
    createTaskSchema,
    updateTaskSchema
} from "../schemas/task.schema.js";

const router = Router();

// GET all tasks
router.get("/", getAllTasks);

// GET task by ID
router.get("/:id", getTaskById);

// POST create task
router.post(
    "/",
    validateBody(createTaskSchema),
    createTask
);

// PUT update task
router.put(
    "/:id",
    validateBody(updateTaskSchema),
    updateTask
);

// DELETE task
router.delete("/:id", deleteTask);

export default router;
