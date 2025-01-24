"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const index_1 = __importDefault(require("../../router/index")); // Adjust the path if needed
const errorHandler_1 = require("../../middleware/errorHandler");
const body_parser_1 = __importDefault(require("body-parser"));
const createApp = () => {
    const app = (0, express_1.default)();
    // Middleware
    app.use((0, cors_1.default)());
    app.use((0, morgan_1.default)("dev"));
    app.use(body_parser_1.default.json({ limit: "50mb" }));
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    app.use("/api", index_1.default);
    app.use(errorHandler_1.globalErrorHandler);
    app.use(errorHandler_1.notFoundHandler);
    return app;
};
exports.default = createApp;
