"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dbconfig_1 = __importDefault(require("../../dbconfig/dbconfig"));
const ReasonForLeaving_1 = __importDefault(require("../ReasonForLeaving/ReasonForLeaving"));
class ReasonAnswer extends sequelize_1.Model {
}
ReasonAnswer.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    reason_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    Reason_answer: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: "ReasonAnswer",
    sequelize: dbconfig_1.default,
    timestamps: true,
});
ReasonForLeaving_1.default.hasMany(ReasonAnswer, { foreignKey: "reason_id", onDelete: "CASCADE", });
ReasonAnswer.belongsTo(ReasonForLeaving_1.default, { foreignKey: "reason_id", onDelete: "CASCADE", });
exports.default = ReasonAnswer;
