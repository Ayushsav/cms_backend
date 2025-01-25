"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dbconfig_1 = __importDefault(require("../../dbconfig/dbconfig"));
class ClientSecurity extends sequelize_1.Model {
}
ClientSecurity.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    ClientId: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    QuestionId: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    Answer: {
        type: sequelize_1.DataTypes.STRING,
    },
}, {
    timestamps: true,
    sequelize: dbconfig_1.default,
});
exports.default = ClientSecurity;
