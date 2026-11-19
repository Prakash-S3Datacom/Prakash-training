
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

import app from "../../src/app.js";
import { pool } from "../../src/config/database.js";

const testEmail = `task-integration-${Date.now()}@example.com`;
const testPassword = "TestPassword123!";

const agent = request.agent(app);
const createdTaskIds: number[] = [];

describe("Task API Integration Tests", () => {

    beforeAll(async () => {
        // Safety check: use only the test database.
        if (process.env.DB_NAME !== "taskdb_test") {
            throw new Error(
                "Integration tests must run only against taskdb_test"
            );
        }

        const result = await pool.query("SELECT current_database()");
        expect(result.rows[0].current_database).toBe("taskdb_test");

        // Register a test user.
        const registerResponse = await agent
            .post("/api/auth/register")
            .send({
                name: "Task Integration User",
                email: testEmail,
                password: testPassword
            });

        expect(registerResponse.status).toBe(201);

        // Login to obtain the authentication cookie.
        const loginResponse = await agent
            .post("/api/auth/login")
            .send({
                email: testEmail,
                password: testPassword
            });

        expect(loginResponse.status).toBe(200);
    });

    afterAll(async () => {
        // Remove tasks created during these tests.
        if (createdTaskIds.length > 0) {
            await pool.query(
                "DELETE FROM tasks WHERE id = ANY($1::int[])",
                [createdTaskIds]
            );
        }

        // Remove the test user.
        await pool.query(
            "DELETE FROM users WHERE email = $1",
            [testEmail]
        );

        await pool.end();
    });

    it("should reject requests without authentication", async () => {
        const response = await request(app)
            .get("/api/tasks");

        expect(response.status).toBe(401);
    });

    it("should create a new task", async () => {
        const response = await agent
            .post("/api/tasks")
            .send({
                title: "Integration Test Task",
                description: "Testing task creation",
                status: "PENDING"
            });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.title).toBe(
            "Integration Test Task"
        );

        expect(response.body.data.id).toBeDefined();

        createdTaskIds.push(response.body.data.id);
    });

    it("should reject a task with an empty title", async () => {
        const response = await agent
            .post("/api/tasks")
            .send({
                title: "",
                description: "Invalid task"
            });

        expect(response.status).toBe(400);
    });

    it("should fetch all tasks", async () => {
        const response = await agent.get("/api/tasks");

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);

        expect(
            response.body.data.some(
                (task: { id: number }) =>
                    task.id === createdTaskIds[0]
            )
        ).toBe(true);
    });

    it("should fetch a task by ID", async () => {
        const taskId = createdTaskIds[0];

        const response = await agent
            .get(`/api/tasks/${taskId}`);

        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(taskId);
        expect(response.body.data.title).toBe(
            "Integration Test Task"
        );
    });

    it("should update an existing task", async () => {
        const taskId = createdTaskIds[0];

        const response = await agent
            .put(`/api/tasks/${taskId}`)
            .send({
                title: "Updated Integration Task",
                status: "IN_PROGRESS"
            });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.title).toBe(
            "Updated Integration Task"
        );
        expect(response.body.data.status).toBe("IN_PROGRESS");
    });

    it("should reject an update with an empty body", async () => {
        const taskId = createdTaskIds[0];

        const response = await agent
            .put(`/api/tasks/${taskId}`)
            .send({});

        expect(response.status).toBe(400);
    });

    it("should prevent a normal user from deleting a task", async () => {
        const taskId = createdTaskIds[0];

        const response = await agent
            .delete(`/api/tasks/${taskId}`);

        expect(response.status).toBe(403);
    });
});

