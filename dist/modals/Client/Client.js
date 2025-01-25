"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dbconfig_1 = __importDefault(require("../../dbconfig/dbconfig"));
const User_1 = __importDefault(require("../User/User"));
class Client extends sequelize_1.Model {
}
Client.init({
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
    Address: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    PostCode: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    GstNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [9, 15], // GST number length validation
        },
    },
    Status: {
        type: sequelize_1.DataTypes.ENUM,
        values: ["Active", "InActive"],
        allowNull: false,
        defaultValue: "Active",
    },
}, {
    tableName: "Client", // Pluralized table name
    sequelize: // Pluralized table name
    dbconfig_1.default,
    timestamps: true, // Includes createdAt and updatedAt fields
});
Client.belongsTo(User_1.default, { foreignKey: "userId", as: "user", onDelete: "CASCADE" });
User_1.default.hasOne(Client, { foreignKey: "userId", as: "client", onDelete: "CASCADE" });
exports.default = Client;
