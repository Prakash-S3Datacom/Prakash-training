
import { taskRepository } from "../repositories/task.repository.js";
import type { Task } from "../repositories/task.repository.js";
import type {
    CreateTaskInput,
    UpdateTaskInput
} from "../schemas/task.schema.js";
import { AppError } from "../middleware/error.middleware.js";

class TaskService {
    async getAllTasks(): Promise<Task[]> {
        return await taskRepository.findAll();
    }

    async getTaskById(id: number): Promise<Task> {
        this.validateId(id);

        const task = await taskRepository.findById(id);

        if (!task) {
            throw new AppError(404, "Task not found");
        }

        return task;
    }

    async createTask(data: CreateTaskInput): Promise<Task> {
        return await taskRepository.create({
            title: data.title,
            description: data.description ?? "",
            status: data.status
        });
    }

    async updateTask(
        id: number,
        data: UpdateTaskInput
    ): Promise<Task> {
        this.validateId(id);

        const updatedTask = await taskRepository.update(id, data);

        if (!updatedTask) {
            throw new AppError(404, "Task not found");
        }

        return updatedTask;
    }

    async deleteTask(id: number): Promise<void> {
        this.validateId(id);

        const deleted = await taskRepository.delete(id);

        if (!deleted) {
            throw new AppError(404, "Task not found");
        }
    }

    private validateId(id: number): void {
        if (!Number.isInteger(id) || id <= 0) {
            throw new AppError(400, "Invalid task ID");
        }
    }
}

export const taskService = new TaskService();
