
import { ObjectId } from "mongodb";

import { taskRepository } from "../repositories/task.repository.js";
import type { Task } from "../models/task.model.js";

import type {
    CreateTaskInput,
    UpdateTaskInput
} from "../schemas/task.schema.js";

import { AppError } from "../middleware/error.middleware.js";

class TaskService {

    // Get all tasks
    async getAllTasks(): Promise<Task[]> {
        return await taskRepository.findAll();
    }

    // Get task by ID
    async getTaskById(id: string): Promise<Task> {
        this.validateId(id);

        const task = await taskRepository.findById(id);

        if (!task) {
            throw new AppError(404, "Task not found");
        }

        return task;
    }

    // Create task
    async createTask(data: CreateTaskInput): Promise<Task> {
        return await taskRepository.create(data);
    }

    // Update task
    async updateTask(
        id: string,
        data: UpdateTaskInput
    ): Promise<Task> {
        this.validateId(id);

        const updatedTask = await taskRepository.update(id, data);

        if (!updatedTask) {
            throw new AppError(404, "Task not found");
        }

        return updatedTask;
    }

    // Delete task
    async deleteTask(id: string): Promise<void> {
        this.validateId(id);

        const deleted = await taskRepository.delete(id);

        if (!deleted) {
            throw new AppError(404, "Task not found");
        }
    }

    // Validate MongoDB ObjectId
    private validateId(id: string): void {
        if (!ObjectId.isValid(id)) {
            throw new AppError(400, "Invalid task ID");
        }
    }
}

export const taskService = new TaskService();
