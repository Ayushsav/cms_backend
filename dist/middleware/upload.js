"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/middlewares/upload.ts
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const fileFilter = (req, file, cb) => {
    const fileTypes = /csv/;
    const extName = fileTypes.test(path_1.default.extname(file.originalname).toLowerCase());
    if (extName) {
        return cb(null, true);
    }
    else {
        cb(new Error('Only CSV files are allowed'));
    }
};
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
});
exports.default = upload;
