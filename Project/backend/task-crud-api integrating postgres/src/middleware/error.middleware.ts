
import type {
    Request,
    Response,
    NextFunction
} from "express";

import multer from "multer";

export class AppError extends Error {
    constructor(
        public statusCode: number,
        message: string
    ) {
        super(message);
        this.name = "AppError";
    }
}

export function errorHandler(
    error: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {

    // Application errors
    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            success: false,
            message: error.message
        });
        return;
    }

    // Multer upload errors
    if (error instanceof multer.MulterError) {
        const statusCode =
            error.code === "LIMIT_FILE_SIZE" ? 413 : 400;

        const message =
            error.code === "LIMIT_FILE_SIZE"
                ? "File size must not exceed 5 MB"
                : error.message;

        res.status(statusCode).json({
            success: false,
            message
        });
        return;
    }

    console.error(error);

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
}
