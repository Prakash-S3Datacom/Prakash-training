
import type { ObjectId } from "mongodb";
import type { TaskStatus } from "../schemas/task.schema.js";

export interface Task {
    _id?: ObjectId;
    title: string;
    description: string;
    status: TaskStatus;
    createdAt: Date;
    updatedAt: Date;
}
