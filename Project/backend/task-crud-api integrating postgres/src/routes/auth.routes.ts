import { Router } from "express";
import { loginRateLimiter } from "../middleware/rateLimit.middleware.js";
import {
    register,
    login,
    getCurrentUser,
    logout
} from "../controllers/auth.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);

// router.post("/login", login);
router.post("/login", loginRateLimiter, login);

router.get("/me", verifyToken, getCurrentUser);
router.post("/logout", logout);

export default router;