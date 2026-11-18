
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/repositories/task.repository.js", () => ({
    taskRepository: {
        findAll: vi.fn(),
        findById: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn()
    }
}));

import { taskService } from "../../src/services/task.service.js";
import { taskRepository } from "../../src/repositories/task.repository.js";
import { AppError } from "../../src/middleware/error.middleware.js";

describe("TaskService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return all tasks", async () => {
        const mockResult = {
            tasks: [],
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0
        };

        vi.mocked(taskRepository.findAll).mockResolvedValue(mockResult);

        const result = await taskService.getAllTasks({
            page: 1,
            limit: 10,
            search: "",
            sortBy: "id",
            sortOrder: "desc"
        });

        expect(result).toEqual(mockResult);
        expect(taskRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it("should throw 400 for an invalid task ID", async () => {
        await expect(taskService.getTaskById(0))
            .rejects.toMatchObject({
                statusCode: 400,
                message: "Invalid task ID"
            });

        expect(taskRepository.findById).not.toHaveBeenCalled();
    });

    it("should throw 404 when task is not found", async () => {
        vi.mocked(taskRepository.findById).mockResolvedValue(undefined);

        await expect(taskService.getTaskById(999))
            .rejects.toBeInstanceOf(AppError);
    });

    it("should return a task when found", async () => {
       const mockTask = {
    id: 1,
    title: "Test task",
    description: "Unit testing",
    status: "PENDING" as const,
    createdAt: new Date(),
    updatedAt: new Date()
};

        vi.mocked(taskRepository.findById).mockResolvedValue(mockTask);

        const result = await taskService.getTaskById(1);

        expect(result).toEqual(mockTask);
    });

    it("should create a task", async () => {
       const input = {
    title: "New task",
    description: "Testing",
    status: "PENDING" as const
};
       const createdTask = {
    id: 1,
    ...input,
    createdAt: new Date(),
    updatedAt: new Date()
};

        vi.mocked(taskRepository.create).mockResolvedValue(createdTask);

        const result = await taskService.createTask(input);

        expect(result).toEqual(createdTask);
        expect(taskRepository.create).toHaveBeenCalledWith(input);
    });

    it("should throw 404 when updating a missing task", async () => {
        vi.mocked(taskRepository.update).mockResolvedValue(undefined);

        await expect(taskService.updateTask(999, { title: "Updated" }))
            .rejects.toBeInstanceOf(AppError);
    });

    it("should throw 404 when deleting a missing task", async () => {
        vi.mocked(taskRepository.delete).mockResolvedValue(false);

        await expect(taskService.deleteTask(999))
            .rejects.toBeInstanceOf(AppError);
    });

    it("should delete an existing task", async () => {
        vi.mocked(taskRepository.delete).mockResolvedValue(true);

        await expect(taskService.deleteTask(1)).resolves.toBeUndefined();

        expect(taskRepository.delete).toHaveBeenCalledWith(1);
    });
});
