
import { Router } from "express";
import upload from "../config/upload.js";
import {
    uploadAttachment,
    getTaskAttachments,
    downloadAttachment,
    deleteAttachment
} from "../controllers/attachment.controller.js";

const router = Router();

// Upload one attachment to a task.
router.post(
    "/tasks/:taskId/attachments",
    upload.single("file"),
    uploadAttachment
);

// List attachments belonging to a task.
router.get(
    "/tasks/:taskId/attachments",
    getTaskAttachments
);

// Download an attachment.
router.get(
    "/attachments/:id/download",
    downloadAttachment
);

// Delete an attachment.
router.delete(
    "/attachments/:id",
    deleteAttachment
);

export default router;
