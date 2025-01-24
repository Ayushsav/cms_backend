"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/WorkExperience.ts
const sequelize_1 = require("sequelize");
const dbconfig_1 = __importDefault(require("../../dbconfig/dbconfig"));
const Candidate_1 = __importDefault(require("../Candidate/Candidate"));
class WorkExperience extends sequelize_1.Model {
}
WorkExperience.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    candidateId: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: Candidate_1.default,
            key: 'id',
        },
        allowNull: false,
    },
    years: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    currentCtc: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
}, {
    tableName: 'work_experiences',
    sequelize: dbconfig_1.default,
});
exports.default = WorkExperience;
