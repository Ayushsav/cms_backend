"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dbconfig_1 = __importDefault(require("../../dbconfig/dbconfig"));
const Client_1 = __importDefault(require("../Client/Client"));
const Tag_1 = __importDefault(require("../Tag/Tag"));
// Model class
class ClientTags extends sequelize_1.Model {
}
ClientTags.init({
    ClientId: {
        type: sequelize_1.DataTypes.INTEGER,
        field: 'ClientId', // Explicitly define the column name
        references: {
            model: Client_1.default,
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        primaryKey: true, // Consider adding this if it's part of a composite primary key
    },
    tagId: {
        type: sequelize_1.DataTypes.INTEGER,
        field: 'tagId', // Explicitly define the column name
        references: {
            model: Tag_1.default,
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        primaryKey: true, // Consider adding this if it's part of a composite primary key
    }
}, {
    tableName: "Client_tags",
    sequelize: dbconfig_1.default,
    timestamps: false, // Add this if you don't want createdAt and updatedAt
    underscored: false, // Ensure column names match exactly
});
// Associations
Client_1.default.belongsToMany(Tag_1.default, {
    through: ClientTags,
    foreignKey: "ClientId",
    otherKey: "tagId",
    as: "tags"
});
Tag_1.default.belongsToMany(Client_1.default, {
    through: ClientTags,
    foreignKey: "tagId",
    otherKey: "ClientId",
    as: "Clients"
});
exports.default = ClientTags;
