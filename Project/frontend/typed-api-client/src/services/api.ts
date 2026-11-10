
import type { User, Post, Comment } from "../types/api.types.js";

const BASE_URL = "https://jsonplaceholder.typicode.com";

// Generic reusable API function
async function apiGet<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`);

    if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
    }

    return response.json() as Promise<T>;
}

// Fetch all users
export function getUsers(): Promise<User[]> {
    return apiGet<User[]>("/users");
}

// Fetch all posts
export function getPosts(): Promise<Post[]> {
    return apiGet<Post[]>("/posts");
}

// Fetch all comments
export function getComments(): Promise<Comment[]> {
    return apiGet<Comment[]>("/comments");
}
