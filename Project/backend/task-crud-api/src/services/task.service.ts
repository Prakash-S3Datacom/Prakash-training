
import { taskRepository } from "../repositories/task.repository.js";
import type { Task } from "../repositories/task.repository.js";

import type {
    CreateTaskInput,
    UpdateTaskInput
} from "../schemas/task.schema.js";

import { AppError } from "../middleware/error.middleware.js";

class TaskService {

    getAllTasks(): Task[] {
        return taskRepository.findAll();
    }

    getTaskById(id: number): Task {
        this.validateId(id);

        const task = taskRepository.findById(id);

        if (!task) {
            throw new AppError(404, "Task not found");
        }

        return task;
    }

    createTask(data: CreateTaskInput): Task {
        return taskRepository.create({
            title: data.title,
            description: data.description ?? "",
            status: data.status
        });
    }

    updateTask(id: number, data: UpdateTaskInput): Task {
        this.getTaskById(id);

        const updatedTask = taskRepository.update(id, data);

        if (!updatedTask) {
            throw new AppError(404, "Task not found");
        }

        return updatedTask;
    }

    deleteTask(id: number): void {
        this.validateId(id);

        const deleted = taskRepository.delete(id);

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
