"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dotenvconfig = {
    DB_HOST: process.env.DB_HOST || "localhost",
    DB_NAME: process.env.DB_NAME || "testdb",
    DB_PASSWORD: process.env.DB_PASSWORD || "",
    DB_USER: process.env.DB_USER || "root",
};
exports.default = dotenvconfig;
