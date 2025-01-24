"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenvconfig_1 = __importDefault(require("./dotenvconfig"));
// Initialize Sequelize connection
const sequelize = new sequelize_1.Sequelize(dotenvconfig_1.default.DB_NAME, dotenvconfig_1.default.DB_USER, dotenvconfig_1.default.DB_PASSWORD, {
    host: dotenvconfig_1.default.DB_HOST,
    dialect: "mysql",
});
exports.default = sequelize;
