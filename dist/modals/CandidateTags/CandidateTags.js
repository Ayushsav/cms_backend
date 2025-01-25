"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dbconfig_1 = __importDefault(require("../../dbconfig/dbconfig"));
const Candidate_1 = __importDefault(require("../Candidate/Candidate"));
const Tag_1 = __importDefault(require("../Tag/Tag"));
class CandidateTags extends sequelize_1.Model {
}
CandidateTags.init({
    candidateId: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: Candidate_1.default,
            key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    },
    tagId: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: Tag_1.default,
            key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    },
}, {
    tableName: "candidate_tags",
    sequelize: dbconfig_1.default,
});
// Candidate - Tag (Many-to-Many)
Candidate_1.default.belongsToMany(Tag_1.default, {
    through: CandidateTags,
    foreignKey: "candidateId",
    otherKey: "tagId",
    as: "tags",
});
Tag_1.default.belongsToMany(Candidate_1.default, {
    through: CandidateTags,
    foreignKey: "tagId",
    otherKey: "candidateId",
    as: "candidates",
});
exports.default = CandidateTags;
