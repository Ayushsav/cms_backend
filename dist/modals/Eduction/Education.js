"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/Education.ts
const sequelize_1 = require("sequelize");
const dbconfig_1 = __importDefault(require("../../dbconfig/dbconfig"));
const Candidate_1 = __importDefault(require("../Candidate/Candidate"));
class Education extends sequelize_1.Model {
}
Education.init({
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
    ugCourse: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    pgCourse: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'educations',
    sequelize: dbconfig_1.default,
});
exports.default = Education;
