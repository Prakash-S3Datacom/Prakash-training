
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Define JWT payload structure
interface TokenPayload extends JwtPayload {
    userId: number;
    role: string;
}

// Extend Express Request
declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}

export const verifyToken = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Get JWT from HttpOnly cookie
        const token = req.cookies?.token;

        // Check whether token exists
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. Please login first."
            });
        }

        // Check JWT secret
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            return res.status(500).json({
                success: false,
                message: "JWT secret is not configured."
            });
        }

        // Verify JWT signature and expiration
        const decoded = jwt.verify(token, secret);

        // Validate decoded payload
        if (
            typeof decoded === "string" ||
            typeof decoded.userId !== "number" ||
            typeof decoded.role !== "string"
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid token payload."
            });
        }

        // Attach authenticated user
        req.user = decoded as TokenPayload;

        // Continue to protected route
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });
    }
};


export const authorizeRoles = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to perform this action"
            });
        }

        next();
    };
};
