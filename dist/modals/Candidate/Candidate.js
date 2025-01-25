"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dbconfig_1 = __importDefault(require("../../dbconfig/dbconfig"));
const User_1 = __importDefault(require("../User/User"));
const Designation_1 = __importDefault(require("../Designation/Designation"));
class Candidate extends sequelize_1.Model {
}
Candidate.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    resumeTitle: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    contactNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    whatsappNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    workExp: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    currentCTC: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    currentLocation: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    state: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    currentEmployeer: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    postalAddress: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    lastActive: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    preferredLocation: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    dob: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    remarks: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
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
    designationId: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: Designation_1.default,
            key: 'id',
        },
        allowNull: false,
    },
    country: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    city: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    lastReminderSent: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: new Date(),
    },
}, {
    tableName: "candidates",
    sequelize: dbconfig_1.default,
});
// Candidate - User (Many-to-One)
Candidate.belongsTo(User_1.default, {
    foreignKey: "UserId",
    as: "user",
    onDelete: "CASCADE",
});
User_1.default.hasMany(Candidate, {
    foreignKey: "UserId",
    as: "candidates",
    onDelete: "CASCADE",
});
// // Candidate - Designation (Many-to-One)
Candidate.belongsTo(Designation_1.default, {
    foreignKey: "designationId",
    as: "designation",
    onDelete: "CASCADE",
});
Designation_1.default.hasMany(Candidate, {
    foreignKey: "designationId",
    as: "candidates",
    onDelete: "CASCADE",
});
// // // // Candidate - Region (Many-to-One)
// Candidate.belongsTo(Region, {
//   foreignKey: "regionId",
//   as: "region"
// });
// Region.hasMany(Candidate, {
//   foreignKey: "regionId",
//   as: "candidates"
// });
exports.default = Candidate;
