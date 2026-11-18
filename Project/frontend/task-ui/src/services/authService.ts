
// const API_URL = "http://localhost:3000/api/auth";

const API_URL = "/api/auth";

export interface User {
    id: number;
    name: string;
    email: string;
    role: "ADMIN" | "USER";
}

export interface RegisterInput {
    name: string;
    email: string;
    password: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

// interface ApiResponse<T> {
//     success: boolean;
//     message: string;
//     user: T;
// }

// Common API response handler
async function handleResponse<T>(
    response: Response
): Promise<T> {
    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "Something went wrong"
        );
    }

    return result.user as T;
}

// Register a new user
export async function registerUser(
    input: RegisterInput
): Promise<User> {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(input)
    });

    return handleResponse<User>(response);
}

// Login existing user
export async function loginUser(
    input: LoginInput
): Promise<User> {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(input)
    });

    return handleResponse<User>(response);
}

// Get currently logged-in user
export async function getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_URL}/me`, {
        credentials: "include"
    });

    return handleResponse<User>(response);
}

// Logout user
export async function logoutUser(): Promise<void> {
    const response = await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include"
    });

    if (!response.ok) {
        const result = await response.json();

        throw new Error(
            result.message || "Unable to logout"
        );
    }
}
