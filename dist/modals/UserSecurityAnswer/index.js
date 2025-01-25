"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dbconfig_1 = __importDefault(require("../../dbconfig/dbconfig"));
const User_1 = __importDefault(require("../User/User"));
const index_1 = __importDefault(require("../SecurityQuestions/index"));
class UserSecurityAnswer extends sequelize_1.Model {
}
UserSecurityAnswer.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: User_1.default,
            key: 'id',
        },
    },
    questionId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: index_1.default,
            key: 'id',
        },
    },
    answerHash: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: dbconfig_1.default,
    modelName: 'UserSecurityAnswer',
});
//write associations here hasone and belongs
UserSecurityAnswer.belongsTo(User_1.default, {
    foreignKey: 'userId',
    as: 'user',
});
User_1.default.hasOne(UserSecurityAnswer, {
    foreignKey: 'userId',
    as: 'userSecurityAnswer',
});
//write associations here for question
UserSecurityAnswer.belongsTo(index_1.default, {
    foreignKey: 'questionId',
    as: 'securityQuestion',
});
index_1.default.hasOne(UserSecurityAnswer, {
    foreignKey: 'questionId',
    as: 'userSecurityAnswer',
});
exports.default = UserSecurityAnswer;
