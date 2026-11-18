
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
    verifyToken,
    authorizeRoles
} from "../middleware/auth.middleware.js";

import {
    createTaskSchema,
    updateTaskSchema
} from "../schemas/task.schema.js";

const router = Router();

// All task routes require authentication.
router.use(verifyToken);

// USER and ADMIN can view tasks.
router.get("/", getAllTasks);
router.get("/:id", getTaskById);

// USER and ADMIN can create tasks.
router.post(
    "/",
    validateBody(createTaskSchema),
    createTask
);

// USER and ADMIN can update tasks.
router.put(
    "/:id",
    validateBody(updateTaskSchema),
    updateTask
);

// Only ADMIN can delete tasks.
router.delete(
    "/:id",
    authorizeRoles("ADMIN"),
    deleteTask
);

export default router;
