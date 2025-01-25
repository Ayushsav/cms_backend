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
    ugCourse: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    pgCourse: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    postPgCourse: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    candidateId: {
        type: sequelize_1.DataTypes.INTEGER, // Make sure this matches `candidates.id`
        references: {
            model: Candidate_1.default, // Reference the Candidate model
            key: "id",
        },
        // onDelete: "SET NULL",
        // onUpdate: "CASCADE",
        // allowNull: true,
    },
}, {
    tableName: "educations",
    sequelize: dbconfig_1.default,
});
// Candidate - Education (One-to-One)
Candidate_1.default.hasOne(Education, {
    foreignKey: "candidateId",
    as: "education",
    onDelete: "CASCADE",
});
Education.belongsTo(Candidate_1.default, {
    foreignKey: "candidateId",
    as: "candidate",
    onDelete: "CASCADE",
});
exports.default = Education;
