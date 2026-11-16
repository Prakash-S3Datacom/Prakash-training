
import type { TaskStatus } from "../schemas/task.schema.js";

export interface Task {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    createdAt: Date;
    updatedAt: Date;
}

class TaskRepository {
    private tasks: Task[] = [];
    private nextId = 1;

    findAll(): Task[] {
        return [...this.tasks];
    }

    findById(id: number): Task | undefined {
        return this.tasks.find(task => task.id === id);
    }

    create(
        data: Omit<Task, "id" | "createdAt" | "updatedAt">
    ): Task {
        const now = new Date();

        const task: Task = {
            id: this.nextId++,
            ...data,
            createdAt: now,
            updatedAt: now
        };

        this.tasks.push(task);

        return task;
    }

    update(
        id: number,
        data: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>
    ): Task | undefined {
        const task = this.findById(id);

        if (!task) {
            return undefined;
        }

        Object.assign(task, data, {
            updatedAt: new Date()
        });

        return task;
    }

    delete(id: number): boolean {
        const index = this.tasks.findIndex(
            task => task.id === id
        );

        if (index === -1) {
            return false;
        }

        this.tasks.splice(index, 1);

        return true;
    }
}

export const taskRepository = new TaskRepository();
