
import type { Request, Response, NextFunction } from "express";
import { attachmentService } from "../services/attachment.service.js";
import { AppError } from "../middleware/error.middleware.js";

export const uploadAttachment = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.file) {
            throw new AppError(400, "Please select a file to upload");
        }

        const attachment = await attachmentService.createAttachment(
            {
                taskId: Number(req.params.taskId),
                originalName: req.file.originalname,
                storedName: "",
                mimeType: req.file.mimetype,
                fileSize: req.file.size,
                uploadedBy: req.user!.userId
            },
            req.file.buffer
        );

        res.status(201).json({
            success: true,
            message: "File uploaded successfully",
            data: attachment
        });
    } catch (error) {
        next(error);
    }
};

export const getTaskAttachments = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const attachments = await attachmentService.getAttachments(
            Number(req.params.taskId)
        );

        res.status(200).json({
            success: true,
            data: attachments
        });
    } catch (error) {
        next(error);
    }
};

export const downloadAttachment = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { attachment, file } = await attachmentService.getFile(
            Number(req.params.id)
        );

        const buffer = Buffer.from(await file.arrayBuffer());

        res.type(attachment.mime_type);
        res.attachment(attachment.original_name);
        res.send(buffer);
    } catch (error) {
        next(error);
    }
};

export const deleteAttachment = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        await attachmentService.deleteAttachment(Number(req.params.id));

        res.status(200).json({
            success: true,
            message: "Attachment deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};
