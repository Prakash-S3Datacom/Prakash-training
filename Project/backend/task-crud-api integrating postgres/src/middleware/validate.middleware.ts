
import type { RequestHandler } from "express";
import type { ZodType } from "zod";
import { AppError } from "./error.middleware.js";

export function validateBody(schema: ZodType): RequestHandler {
    return (req, _res, next) => {

        // Validate request body using Zod
        const result = schema.safeParse(req.body);

        // If validation fails
        if (!result.success) {
            const errors = result.error.issues.map(
                issue => issue.message
            );

            next(new AppError(400, errors.join(", ")));
            return;
        }

        // Replace request body with validated data
        req.body = result.data;

        next();
    };
}
