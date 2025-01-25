"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dbconfig_1 = __importDefault(require("../../dbconfig/dbconfig"));
const ReasonForLeaving_1 = __importDefault(require("../ReasonForLeaving/ReasonForLeaving"));
const Candidate_1 = __importDefault(require("../Candidate/Candidate"));
const ReasonAnswer_1 = __importDefault(require("../ReasonAnswer/ReasonAnswer"));
class ReasonSaveAnswer extends sequelize_1.Model {
}
ReasonSaveAnswer.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    candidateId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Candidate_1.default,
            key: "id",
        },
    },
    questionId: {
        type: sequelize_1.DataTypes.INTEGER, // Updated to match ReasonsForLeaving.id type
        allowNull: false,
        references: {
            model: ReasonForLeaving_1.default,
            key: "id",
        },
    },
    answer: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ReasonAnswer_1.default,
            key: "id",
        },
    },
}, {
    tableName: "ReasonSaveAnswer",
    sequelize: dbconfig_1.default,
    timestamps: true, // Enable timestamps if needed
    freezeTableName: true, // Prevent Sequelize from pluralizing table name
});
//assciation
ReasonSaveAnswer.belongsTo(Candidate_1.default, {
    foreignKey: "candidateId",
    as: "candidate",
    onDelete: "CASCADE",
});
ReasonSaveAnswer.belongsTo(ReasonForLeaving_1.default, {
    foreignKey: "questionId",
    as: "reason",
    onDelete: "CASCADE",
});
ReasonForLeaving_1.default.hasMany(ReasonSaveAnswer, {
    foreignKey: "questionId",
    as: "answers",
    onDelete: "CASCADE",
});
Candidate_1.default.hasMany(ReasonSaveAnswer, {
    foreignKey: "candidateId",
    as: "reasons",
    onDelete: "CASCADE",
});
ReasonSaveAnswer.belongsTo(ReasonAnswer_1.default, {
    foreignKey: "answer",
    onDelete: "CASCADE",
});
ReasonAnswer_1.default.hasMany(ReasonSaveAnswer, {
    foreignKey: "answer",
    onDelete: "CASCADE",
});
exports.default = ReasonSaveAnswer;
