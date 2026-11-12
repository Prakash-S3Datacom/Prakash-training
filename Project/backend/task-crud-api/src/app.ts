
import express from "express";

import taskRoutes from "./routes/task.routes.js";

import {
    AppError,
    errorHandler
} from "./middleware/error.middleware.js";

const app = express();

app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Task CRUD API is running"
    });
});

// Task routes
app.use("/api/tasks", taskRoutes);

// Unknown endpoint
app.use((_req, _res, next) => {
    next(new AppError(404, "Endpoint not found"));
});

// Global error handler
app.use(errorHandler);

export default app;
