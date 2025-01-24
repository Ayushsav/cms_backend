"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dbconfig_1 = __importDefault(require("../../dbconfig/dbconfig"));
const User_1 = __importDefault(require("../User/User"));
// Create the Token model class
class Token extends sequelize_1.Model {
}
// Initialize the Token model
Token.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.BIGINT,
        references: {
            model: User_1.default,
            key: "id",
        },
        allowNull: false,
    },
    token: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    expireAt: {
        type: sequelize_1.DataTypes.DATE,
    },
}, {
    sequelize: dbconfig_1.default,
    modelName: "Token",
    tableName: "Tokens", // Adjust table name as needed
    timestamps: true, // Adds createdAt and updatedAt fields automatically
});
exports.default = Token;
