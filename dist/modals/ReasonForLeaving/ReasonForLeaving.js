"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/ReasonsForLeaving.ts
const sequelize_1 = require("sequelize");
const dbconfig_1 = __importDefault(require("../../dbconfig/dbconfig"));
const Candidate_1 = __importDefault(require("../Candidate/Candidate"));
class ReasonsForLeaving extends sequelize_1.Model {
}
ReasonsForLeaving.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    candidateId: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: Candidate_1.default,
            key: "id",
        },
        allowNull: false,
    },
    reason: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: "reasons_for_leaving",
    sequelize: dbconfig_1.default,
});
exports.default = ReasonsForLeaving;
