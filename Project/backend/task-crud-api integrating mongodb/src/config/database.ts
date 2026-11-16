
import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI!;
const databaseName = process.env.MONGODB_DATABASE!;

const client = new MongoClient(uri);

let db: Db;

export const connectDB = async (): Promise<void> => {
    try {
        await client.connect();

        db = client.db(databaseName);

        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        throw error;
    }
};

export const getDB = (): Db => {
    if (!db) {
        throw new Error("Database is not connected");
    }

    return db;
};
