
import type {
    Task,
    CreateTaskInput,
    UpdateTaskInput,
    TaskListParams,
    TaskPageResponse
} from "../types/task";

// const API_URL = "http://localhost:3000/api/tasks";
const API_URL = "/api/tasks";

async function handleResponse<T>(response: Response): Promise<T> {
    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "Something went wrong with the API"
        );
    }

    return result.data as T;
}

// Fetch one page of tasks with optional search, filter and sorting.
export async function getTaskPage(
    params: TaskListParams = {}
): Promise<TaskPageResponse> {
    const query = new URLSearchParams({
        page: String(params.page ?? 1),
        limit: String(params.limit ?? 10),
        sortBy: params.sortBy ?? "id",
        sortOrder: params.sortOrder ?? "desc"
    });

    if (params.search?.trim()) {
        query.set("search", params.search.trim());
    }

    if (params.status) {
        query.set("status", params.status);
    }

    const response = await fetch(
        `${API_URL}?${query.toString()}`,
        {
            credentials: "include"
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "Unable to fetch tasks"
        );
    }

    return {
        tasks: result.data as Task[],
        pagination: result.pagination
    };
}

// Kept for compatibility with the existing App.
export async function getTasks(): Promise<Task[]> {
    const result = await getTaskPage();
    return result.tasks;
}

// Fetch one task
export async function getTaskById(id: number): Promise<Task> {
    const response = await fetch(`${API_URL}/${id}`, {
        credentials: "include"
    });

    return handleResponse<Task>(response);
}

// Create task
export async function createTask(
    task: CreateTaskInput
): Promise<Task> {
    const response = await fetch(API_URL, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
    });

    return handleResponse<Task>(response);
}

// Update task
export async function updateTask(
    id: number,
    task: UpdateTaskInput
): Promise<Task> {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
    });

    return handleResponse<Task>(response);
}

// Delete task
export async function deleteTask(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        credentials: "include"
    });

    if (!response.ok) {
        const result = await response.json();

        throw new Error(
            result.message || "Unable to delete task"
        );
    }
}
