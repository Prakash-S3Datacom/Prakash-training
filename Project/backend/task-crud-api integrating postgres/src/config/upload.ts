
import multer from "multer";
import path from "node:path";
import { AppError } from "../middleware/error.middleware.js";

// Allowed file extensions and MIME types.
const allowedTypes: Record<string, string> = {
    ".pdf": "application/pdf",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
};

// Validate uploaded file type.
const fileFilter: multer.Options["fileFilter"] = (
    _req,
    file,
    callback
) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const expectedMimeType = allowedTypes[extension];

    if (!expectedMimeType || file.mimetype !== expectedMimeType) {
        callback(
            new AppError(
                400,
                "Invalid file type. Only PDF, PNG, JPG, JPEG and DOCX files are allowed."
            )
        );
        return;
    }

    callback(null, true);
};

// Temporarily store files in memory before uploading to Supabase.
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 1
    }
});

export default upload;
