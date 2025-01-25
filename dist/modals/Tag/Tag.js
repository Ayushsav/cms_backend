"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dbconfig_1 = __importDefault(require("../../dbconfig/dbconfig"));
const User_1 = __importDefault(require("../User/User"));
class Tag extends sequelize_1.Model {
}
Tag.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    Tag_Name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    Created_By: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: User_1.default,
            key: "id",
        },
    },
}, {
    tableName: "Tag",
    sequelize: dbconfig_1.default,
    timestamps: true,
});
//write associations here hasone and belongs
Tag.belongsTo(User_1.default, {
    foreignKey: "Created_By",
    as: "user",
    onDelete: "CASCADE",
});
User_1.default.hasOne(Tag, {
    foreignKey: "Created_By",
    as: "tag",
    onDelete: "CASCADE",
});
exports.default = Tag;
