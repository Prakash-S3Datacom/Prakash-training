
import express from "express";
import cors from "cors";

import taskRoutes from "./routes/task.routes.js";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

import {
    AppError,
    errorHandler
} from "./middleware/error.middleware.js";

const app = express();

// Allow requests from React frontend
app.use(cors({
    origin: "http://localhost:5173"
}));

// Parse incoming JSON
app.use(express.json());

// Swagger API documentation
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

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
