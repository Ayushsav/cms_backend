"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Storage Configuration for Profile Images
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/profileImages/';
        // Check if directory exists, create if not
        if (!fs_1.default.existsSync(uploadPath)) {
            fs_1.default.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath); // Folder for profile images
    },
    filename: (req, file, cb) => {
        // Replace spaces with '%20' in the filename
        const sanitizedFilename = file.originalname.replace(/\s/g, '%20');
        cb(null, `${Date.now()}-${sanitizedFilename}`); // Unique filename with sanitized spaces
    },
});
// File Filter for Images
const imageFileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/; // Allowed file types
    const extName = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);
    if (extName && mimeType) {
        cb(null, true);
    }
    else {
        cb(new Error('Only image files (jpeg, jpg, png) are allowed'));
    }
};
// Multer Instance for Images
const uploadImage = (0, multer_1.default)({
    storage,
    fileFilter: imageFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});
exports.default = uploadImage;
