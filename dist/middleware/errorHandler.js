"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.globalErrorHandler = void 0;
// Global error handler with TypeScript
const globalErrorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack, // Hide stack in production
    });
};
exports.globalErrorHandler = globalErrorHandler;
// 404 Not Found handler with TypeScript
const notFoundHandler = (req, res, next) => {
    const error = new Error(`No route found for ${req.originalUrl}`);
    res.status(404);
    res.send("This route does not exist");
};
exports.notFoundHandler = notFoundHandler;
