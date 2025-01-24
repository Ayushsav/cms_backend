"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dbconfig_1 = __importDefault(require("../../dbconfig/dbconfig"));
const User_1 = __importDefault(require("../User/User"));
class Product extends sequelize_1.Model {
}
Product.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    Candidate_Name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    Resume_Title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    Contact_Number: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    Email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    Work_Exp: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    Current_Ctc: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    Salary: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    Current_Location: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    State: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    Region: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    //foreign key
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
    tableName: "Product",
    sequelize: dbconfig_1.default,
});
exports.default = Product;
