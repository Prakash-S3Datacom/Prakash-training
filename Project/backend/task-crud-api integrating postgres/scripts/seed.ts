
import { pool } from "../src/config/database.js";

async function seedTasks() {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Clear existing tasks and reset the ID sequence.
        await client.query(
            "TRUNCATE TABLE tasks RESTART IDENTITY"
        );

        // Generate 10,000 sample tasks.
        const result = await client.query(`
            INSERT INTO tasks (title, description, status)
            SELECT
                'Sample Task ' || n,
                'This is sample task number ' || n,
                CASE
                    WHEN n % 3 = 0 THEN 'COMPLETED'
                    WHEN n % 3 = 1 THEN 'PENDING'
                    ELSE 'IN_PROGRESS'
                END
            FROM generate_series(1, 10000) AS n
        `);

        await client.query("COMMIT");

        console.log(`${result.rowCount} tasks inserted successfully!`);

    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Seeding failed:", error);
    } finally {
        client.release();
        await pool.end();
    }
}

seedTasks();
