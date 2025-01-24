"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/Candidate.ts
const sequelize_1 = require("sequelize");
const dbconfig_1 = __importDefault(require("../../dbconfig/dbconfig"));
const User_1 = __importDefault(require("../User/User"));
class Candidate extends sequelize_1.Model {
}
Candidate.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    resumeTitle: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    contactNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    whatsappNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    workExp: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    currentCTC: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    currentLocation: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    state: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    preferredLocation: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    dob: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    designationId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    UserId: {
        type: sequelize_1.DataTypes.BIGINT,
        references: {
            // This is a reference to another model
            model: User_1.default,
            // This is the column name of the referenced model
            key: 'id',
        },
        allowNull: false,
    },
}, {
    tableName: 'candidates',
    sequelize: dbconfig_1.default,
});
exports.default = Candidate;
