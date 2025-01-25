"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const index_1 = __importDefault(require("../../router/index")); // Adjust the path if needed
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const errorHandler_1 = require("../../middleware/errorHandler");
const body_parser_1 = __importDefault(require("body-parser"));
const path = require('path');
const createApp = () => {
    const app = (0, express_1.default)();
    // Middleware
    app.use('/uploads', express_1.default.static(path.join(__dirname, 'uploads/profileImages')));
    app.use((0, cookie_parser_1.default)());
    app.use((0, cors_1.default)({
        origin: 'http://my-candidate-management-system-bucket.s3-website.eu-north-1.amazonaws.com', // Replace with your actual frontend URL
        credentials: true,
    }));
    app.use((0, morgan_1.default)("dev"));
    app.use(body_parser_1.default.json({ limit: "50mb" }));
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    app.use("/api", index_1.default);
    app.use(errorHandler_1.globalErrorHandler);
    app.use(errorHandler_1.notFoundHandler);
    return app;
};
exports.default = createApp;
