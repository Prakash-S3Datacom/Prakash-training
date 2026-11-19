import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        include: ["tests/integration/**/*.test.ts"],
        testTimeout: 15000,
        hookTimeout: 15000,
        fileParallelism: false,
        env: {
            DB_HOST: "localhost",
            DB_PORT: "5434",
            DB_USER: "postgres",
            DB_NAME: "taskdb_test",
            JWT_SECRET: "integration-test-secret",
            JWT_EXPIRES_IN: "1d"
        }
    }
});