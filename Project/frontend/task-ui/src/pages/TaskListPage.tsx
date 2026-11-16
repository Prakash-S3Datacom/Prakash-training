
import { useCallback, useEffect, useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import {
    getTaskPage,
    createTask,
    updateTask,
    deleteTask
} from "../services/taskService";
import type {
    Task,
    TaskStatus,
    TaskSortField,
    SortOrder,
    TaskPagination,
    CreateTaskInput
} from "../types/task";

function TaskListPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [pagination, setPagination] = useState<TaskPagination>({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
    });

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<TaskStatus | "">("");
    const [sortBy, setSortBy] = useState<TaskSortField>("id");
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const loadTasks = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const result = await getTaskPage({
                page,
                limit: 10,
                search,
                status,
                sortBy,
                sortOrder
            });

            setTasks(result.tasks);
            setPagination(result.pagination);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to load tasks"
            );
        } finally {
            setLoading(false);
        }
    }, [page, search, status, sortBy, sortOrder]);

    useEffect(() => {
        void loadTasks();
    }, [loadTasks]);

    async function handleSubmit(taskData: CreateTaskInput) {
        try {
            setSaving(true);
            setError("");

            if (editingTask) {
                await updateTask(editingTask.id, taskData);
                setEditingTask(null);
                await loadTasks();
            } else {
                await createTask(taskData);
                setPage(1);
                // The page change triggers a fresh request.
                if (page === 1) {
                    await loadTasks();
                }
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to save task"
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id: number) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this task?"
        );

        if (!confirmed) return;

        try {
            setError("");
            await deleteTask(id);

            if (editingTask?.id === id) {
                setEditingTask(null);
            }

            // If the last item on a page is deleted, move back one page.
            if (tasks.length === 1 && page > 1) {
                setPage((currentPage) => currentPage - 1);
            } else {
                await loadTasks();
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to delete task"
            );
        }
    }

    function handleSearchChange(value: string) {
        setSearch(value);
        setPage(1);
    }

    function handleStatusChange(value: string) {
        setStatus(value as TaskStatus | "");
        setPage(1);
    }

    function handleSortChange(value: string) {
        setSortBy(value as TaskSortField);
        setPage(1);
    }

    function handleSortOrderChange(value: string) {
        setSortOrder(value as SortOrder);
        setPage(1);
    }

    return (
        <main className="app-container">
            <header className="app-header">
                <h1>TaskFlow</h1>
                <p>Manage your tasks efficiently</p>
            </header>

            {error && (
                <div className="error-message" role="alert">
                    {error}
                </div>
            )}

            <section className="form-section">
                <TaskForm
                    editingTask={editingTask}
                    onSubmit={handleSubmit}
                    onCancel={() => setEditingTask(null)}
                />
                {saving && <p>Saving task...</p>}
            </section>

            <section className="tasks-section">
                <h2>Your Tasks</h2>

                <div className="task-filters">
                    <input
                        type="search"
                        placeholder="Search tasks..."
                        value={search}
                        onChange={(event) =>
                            handleSearchChange(event.target.value)
                        }
                    />

                    <select
                        value={status}
                        onChange={(event) =>
                            handleStatusChange(event.target.value)
                        }
                    >
                        <option value="">All statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                    </select>

                    <select
                        value={sortBy}
                        onChange={(event) =>
                            handleSortChange(event.target.value)
                        }
                    >
                        <option value="id">ID</option>
                        <option value="title">Title</option>
                        <option value="status">Status</option>
                        <option value="createdAt">Created date</option>
                    </select>

                    <select
                        value={sortOrder}
                        onChange={(event) =>
                            handleSortOrderChange(event.target.value)
                        }
                    >
                        <option value="desc">Descending</option>
                        <option value="asc">Ascending</option>
                    </select>
                </div>

                {loading ? (
                    <p>Loading tasks...</p>
                ) : tasks.length === 0 ? (
                    <p>No tasks found. Try changing your search or filters.</p>
                ) : (
                    <>
                        <TaskList
                            tasks={tasks}
                            onEdit={setEditingTask}
                            onDelete={handleDelete}
                        />

                        <div className="pagination">
                            <p>
                                Showing {tasks.length} of {pagination.total} tasks
                            </p>

                            <button
                                type="button"
                                disabled={page <= 1 || loading}
                                onClick={() => setPage((current) => current - 1)}
                            >
                                Previous
                            </button>

                            <span>
                                Page {pagination.page} of {pagination.totalPages}
                            </span>

                            <button
                                type="button"
                                disabled={
                                    page >= pagination.totalPages || loading
                                }
                                onClick={() => setPage((current) => current + 1)}
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </section>
        </main>
    );
}

export default TaskListPage;
