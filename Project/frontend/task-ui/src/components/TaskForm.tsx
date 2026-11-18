
import { useEffect, useState } from "react";
import type {
    Task,
    CreateTaskInput,
    TaskStatus
} from "../types/task";

interface TaskFormProps {
    editingTask: Task | null;
    onSubmit: (task: CreateTaskInput) => void;
    onCancel: () => void;
}

function TaskForm({
    editingTask,
    onSubmit,
    onCancel
}: TaskFormProps) {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<TaskStatus>("PENDING");

    // Fill the form when editing a task
    useEffect(() => {
        if (editingTask) {
            setTitle(editingTask.title);
            setDescription(editingTask.description);
            setStatus(editingTask.status);
        } else {
            setTitle("");
            setDescription("");
            setStatus("PENDING");
        }
    }, [editingTask]);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!title.trim()) {
            return;
        }

        onSubmit({
            title: title.trim(),
            description: description.trim(),
            status
        });
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>{editingTask ? "Edit Task" : "Create Task"}</h2>

            <label>Title</label>
            <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Enter task title"
                required
            />

            <label>Description</label>
            <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Enter task description"
            />

            <label>Status</label>
            <select
                value={status}
                onChange={(event) =>
                    setStatus(event.target.value as TaskStatus)
                }
            >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
            </select>

            <button type="submit">
                {editingTask ? "Update Task" : "Create Task"}
            </button>

            {editingTask && (
                <button type="button" onClick={onCancel}>
                    Cancel
                </button>
            )}
        </form>
    );
}

export default TaskForm;

