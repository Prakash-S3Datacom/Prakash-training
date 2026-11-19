
export type TaskStatus =
    | "PENDING"
    | "IN_PROGRESS"
    | "COMPLETED";

export interface Task {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTaskInput {
    title: string;
    description?: string;
    status: TaskStatus;
}

export interface UpdateTaskInput {
    title?: string;
    description?: string;
    status?: TaskStatus;
}

export type TaskSortField =
    | "id"
    | "title"
    | "status"
    | "createdAt";

export type SortOrder = "asc" | "desc";

export interface TaskListParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: TaskStatus | "";
    sortBy?: TaskSortField;
    sortOrder?: SortOrder;
}

export interface TaskPagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface TaskPageResponse {
    tasks: Task[];
    pagination: TaskPagination;
}
export interface Attachment {
    id: number;
    task_id: number;
    original_name: string;
    stored_name: string;
    mime_type: string;
    file_size: number;
    uploaded_by: number | null;
    created_at: string;
}
