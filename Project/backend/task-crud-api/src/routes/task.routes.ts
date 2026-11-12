
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

router.get("/", getAllTasks);

router.get("/:id", getTaskById);

router.post(
    "/",
    validateBody(createTaskSchema),
    createTask
);

router.put(
    "/:id",
    validateBody(updateTaskSchema),
    updateTask
);

router.delete("/:id", deleteTask);

export default router;
