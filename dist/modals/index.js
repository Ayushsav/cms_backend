"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/index.ts
const Candidate_1 = __importDefault(require("./Candidate/Candidate"));
// import Contact from './Contacts/Contact';
// import WorkExperience from './WorkExperience/WorkExperience';
// import Education from './Eduction/Education';
const Designation_1 = __importDefault(require("./Designation/Designation"));
const ReasonForLeaving_1 = __importDefault(require("./ReasonForLeaving/ReasonForLeaving"));
// // Candidate and Contact Association
// Candidate.hasMany(Contact, { foreignKey: 'candidateId' });
// Contact.belongsTo(Candidate, { foreignKey: 'candidateId' });
// // Candidate and WorkExperience Association
// Candidate.hasOne(WorkExperience, { foreignKey: 'candidateId' });
// WorkExperience.belongsTo(Candidate, { foreignKey: 'candidateId' });
// // Candidate and Education Association
// Candidate.hasOne(Education, { foreignKey: 'candidateId' });
// Education.belongsTo(Candidate, { foreignKey: 'candidateId' });
// Candidate and Designation Association
Designation_1.default.hasMany(Candidate_1.default, { foreignKey: 'designationId' });
Candidate_1.default.belongsTo(Designation_1.default, { foreignKey: 'designationId' });
// Candidate and ReasonsForLeaving Association
Candidate_1.default.hasMany(ReasonForLeaving_1.default, { foreignKey: 'candidateId' });
ReasonForLeaving_1.default.belongsTo(Candidate_1.default, { foreignKey: 'candidateId' });
