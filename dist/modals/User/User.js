"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const joi_1 = __importDefault(require("joi"));
const dbconfig_1 = __importDefault(require("../../dbconfig/dbconfig"));
class User extends sequelize_1.Model {
    static validateUser(user) {
        const schema = joi_1.default.object({
            FirstName: joi_1.default.string().min(2).max(50).required(),
            LastName: joi_1.default.string().min(2).max(50).required(),
            Email: joi_1.default.string().email().required(),
            Password: joi_1.default.string().min(8).required(),
            Phone: joi_1.default.string()
                .pattern(/^[0-9]+$/)
                .min(10)
                .max(15)
                .optional(),
        });
        return schema.validate(user);
    }
}
User.init({
    id: {
        type: sequelize_1.DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    FirstName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    LastName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    Email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    Password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    Phone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize: dbconfig_1.default,
    modelName: "User",
});
exports.default = User;
