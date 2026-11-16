
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTaskById } from "../services/taskService";
import type { Task } from "../types/task";

function TaskDetailPage() {
    const { id } = useParams<{ id: string }>();

    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadTask() {
            try {
                setLoading(true);
                setError("");

                const taskId = Number(id);

                if (!id || !Number.isInteger(taskId) || taskId <= 0) {
                    throw new Error("Invalid task ID");
                }

                const result = await getTaskById(taskId);
                setTask(result);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Unable to load task"
                );
            } finally {
                setLoading(false);
            }
        }

        void loadTask();
    }, [id]);

    if (loading) {
        return <main className="app-container"><p>Loading task...</p></main>;
    }

    if (error || !task) {
        return (
            <main className="app-container">
                <h1>Task not found</h1>
                <p>{error || "This task does not exist."}</p>
                <Link to="/">Back to task list</Link>
            </main>
        );
    }

    return (
        <main className="app-container">
            <header className="app-header">
                <h1>Task Details</h1>
                <p>Information about task #{task.id}</p>
            </header>

            <section className="task-card">
                <h2>{task.title}</h2>
                <p>{task.description || "No description provided."}</p>
                <p>
                    Status: <strong>{task.status}</strong>
                </p>
                <p>
                    Created: {new Date(task.createdAt).toLocaleString()}
                </p>
                <p>
                    Last updated: {new Date(task.updatedAt).toLocaleString()}
                </p>
                <Link to="/">Back to task list</Link>
            </section>
        </main>
    );
}

export default TaskDetailPage;
