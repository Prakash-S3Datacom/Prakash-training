
import express from "express";

import taskRoutes from "./routes/task.routes.js";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

import {
    AppError,
    errorHandler
} from "./middleware/error.middleware.js";

const app = express();

app.use(express.json());

// Swagger API documentation
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);
 
// Health check
/**
 * @swagger
 * /health:
 *   get:
 *     summary: Check API health
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is running successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Task CRUD API is running
 */
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
