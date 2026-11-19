
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    getTaskById,
    getTaskAttachments,
    uploadAttachment,
    downloadAttachment,
    deleteAttachment
} from "../services/taskService";
import type { Task, Attachment } from "../types/task";

function TaskDetailPage() {
    const { id } = useParams<{ id: string }>();

    const [task, setTask] = useState<Task | null>(null);
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const taskId = Number(id);

    const loadAttachments = useCallback(async () => {
        const result = await getTaskAttachments(taskId);
        setAttachments(result);
    }, [taskId]);

    useEffect(() => {
        async function loadTask() {
            try {
                setLoading(true);
                setError("");

                if (!id || !Number.isInteger(taskId) || taskId <= 0) {
                    throw new Error("Invalid task ID");
                }

                const result = await getTaskById(taskId);
                setTask(result);

                const files = await getTaskAttachments(taskId);
                setAttachments(files);
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
    }, [id, taskId]);

    async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];

        if (!file) return;

        try {
            setUploading(true);
            setError("");
            setMessage("");

            await uploadAttachment(taskId, file);
            await loadAttachments();

            setMessage("File uploaded successfully.");
            event.target.value = "";
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "File upload failed"
            );
        } finally {
            setUploading(false);
        }
    }

    async function handleDownload(attachment: Attachment) {
        try {
            setError("");
            await downloadAttachment(attachment);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Download failed"
            );
        }
    }

    async function handleDelete(attachmentId: number) {
        if (!window.confirm("Are you sure you want to delete this attachment?")) {
            return;
        }

        try {
            setError("");
            setMessage("");

            await deleteAttachment(attachmentId);
            await loadAttachments();

            setMessage("Attachment deleted successfully.");
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Delete failed"
            );
        }
    }

    if (loading) {
        return <main className="app-container"><p>Loading task...</p></main>;
    }

    if (error && !task) {
        return (
            <main className="app-container">
                <h1>Task not found</h1>
                <p>{error}</p>
                <Link to="/">Back to task list</Link>
            </main>
        );
    }

    if (!task) return null;

    return (
        <main className="app-container">
            <header className="app-header">
                <h1>Task Details</h1>
                <p>Information about task #{task.id}</p>
            </header>

            <section className="task-card">
                <h2>{task.title}</h2>
                <p>{task.description || "No description provided."}</p>
                <p>Status: <strong>{task.status}</strong></p>
                <p>Created: {new Date(task.createdAt).toLocaleString()}</p>
                <p>Last updated: {new Date(task.updatedAt).toLocaleString()}</p>

                <hr />

                <h2>Attachments</h2>
                <p>Upload PDF, PNG, JPG or DOCX files (maximum 5 MB).</p>

                <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.docx"
                    onChange={handleUpload}
                    disabled={uploading}
                />

                {uploading && <p>Uploading file...</p>}

                {error && <p role="alert">{error}</p>}
                {message && <p role="status">{message}</p>}

                <h3>Uploaded files ({attachments.length})</h3>

                {attachments.length === 0 ? (
                    <p>No attachments uploaded yet.</p>
                ) : (
                    <ul>
                        {attachments.map((attachment) => (
                            <li key={attachment.id}>
                                <strong>{attachment.original_name}</strong>
                                {" "}({(attachment.file_size / 1024).toFixed(1)} KB)
                                {" "}
                                <button
                                    type="button"
                                    onClick={() => void handleDownload(attachment)}
                                >
                                    Download
                                </button>
                                {" "}
                                <button
                                    type="button"
                                    onClick={() => void handleDelete(attachment.id)}
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
                <hr />
                <Link to="/">Back to task list</Link>
            </section>
        </main>
    );
}

export default TaskDetailPage;
