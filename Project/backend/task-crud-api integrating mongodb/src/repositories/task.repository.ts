
import { ObjectId } from "mongodb";
import { getDB } from "../config/database.js";
import type { Task } from "../models/task.model.js";
import type {
    CreateTaskInput,
    UpdateTaskInput
} from "../schemas/task.schema.js";

class TaskRepository {
    private collection = () => getDB().collection<Task>("tasks");

    // Get all tasks
    async findAll(): Promise<Task[]> {
        return this.collection().find().toArray();
    }

    // Get task by ID
    async findById(id: string): Promise<Task | null> {
        return this.collection().findOne({
            _id: new ObjectId(id)
        });
    }

    // Create task
    async create(data: CreateTaskInput): Promise<Task> {
        const now = new Date();

        const task: Task = {
            title: data.title,
            description: data.description ?? "",
            status: data.status,
            createdAt: now,
            updatedAt: now
        };

        const result = await this.collection().insertOne(task);

        return {
            ...task,
            _id: result.insertedId
        };
    }

    // Update task
    async update(
        id: string,
        data: UpdateTaskInput
    ): Promise<Task | null> {
        await this.collection().updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    ...data,
                    updatedAt: new Date()
                }
            }
        );

        return this.findById(id);
    }

    // Delete task
    async delete(id: string): Promise<boolean> {
        const result = await this.collection().deleteOne({
            _id: new ObjectId(id)
        });

        return result.deletedCount === 1;
    }
}

export const taskRepository = new TaskRepository();
