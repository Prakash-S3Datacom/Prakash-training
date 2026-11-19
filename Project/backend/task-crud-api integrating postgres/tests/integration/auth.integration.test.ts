import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

import app from "../../src/app.js";
import { pool } from "../../src/config/database.js";

const testEmail = `integration-${Date.now()}@example.com`;
const testPassword = "TestPassword123!";
const agent = request.agent(app);

describe("Authentication API Integration Tests", () => {

    beforeAll(async () => {
        // Safety check: never run against the development database.
        if (process.env.DB_NAME !== "taskdb_test") {
            throw new Error(
                "Integration tests must run only against taskdb_test"
            );
        }

        const result = await pool.query("SELECT current_database()");
        expect(result.rows[0].current_database).toBe("taskdb_test");
    });

    afterAll(async () => {
        // Remove the test user created by this test suite.
        await pool.query(
            "DELETE FROM users WHERE email = $1",
            [testEmail]
        );

        await pool.end();
    });

    it("should register a new user", async () => {
        const response = await agent
            .post("/api/auth/register")
            .send({
                name: "Integration Test User",
                email: testEmail,
                password: testPassword
            });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.user.email).toBe(testEmail);
        expect(response.body.user).not.toHaveProperty("password_hash");
    });

    it("should reject duplicate email registration", async () => {
        const response = await agent
            .post("/api/auth/register")
            .send({
                name: "Integration Test User",
                email: testEmail,
                password: testPassword
            });

        expect(response.status).toBe(409);
        expect(response.body.message).toBe("Email already registered");
    });

    it("should reject a password shorter than 8 characters", async () => {
        const response = await agent
            .post("/api/auth/register")
            .send({
                name: "Short Password User",
                email: `short-${Date.now()}@example.com`,
                password: "123"
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe(
            "Password must contain at least 8 characters"
        );
    });

    it("should login with valid credentials", async () => {
        const response = await agent
            .post("/api/auth/login")
            .send({
                email: testEmail,
                password: testPassword
            });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.user.email).toBe(testEmail);

        // const cookies = response.headers["set-cookie"];
        // expect(cookies).toBeDefined();
        // expect(cookies.join(";")).toContain("token=");
        const cookies = response.headers["set-cookie"];

expect(cookies).toBeDefined();

const cookieString = Array.isArray(cookies)
    ? cookies.join(";")
    : cookies;

expect(cookieString).toContain("token=");
    });

    it("should return the current user using the login cookie", async () => {
        const response = await agent.get("/api/auth/me");

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.user.email).toBe(testEmail);
    });

    it("should reject access to current user without authentication", async () => {
        const response = await request(app).get("/api/auth/me");

        expect(response.status).toBe(401);
    });
});