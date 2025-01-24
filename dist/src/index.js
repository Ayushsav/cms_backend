"use strict";
// import dotenv from "dotenv";
// import createApp from "./subserver/subserver";
// import sequelize from "../dbconfig/dbconfig";
// import Product from "../modals/Product/Product";
// import User from "../modals/User/User"
// import Token from "../modals/Token/Token"
// dotenv.config();
// const port = process.env.PORT || 4000;
// const app = createApp();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// // sequelize
// //   .sync()
// //   .then(() => {
// //     console.log("connection established");
// //   })
// //   .catch((error: any) => {
// //     console.error(error.message);
// //   });
// const db = async () => {
//   try{
//     await User.sync();
//     await Product.sync();
//     await Token.sync();
//     console.log("connection established");
//   }
//   catch(error:any){
//     console.error(error.message);
//   }
// }
// db();
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
const dotenv_1 = __importDefault(require("dotenv"));
const subserver_1 = __importDefault(require("./subserver/subserver"));
const dbconfig_1 = __importDefault(require("../dbconfig/dbconfig"));
const Candidate_1 = __importDefault(require("../modals/Candidate/Candidate"));
const Designation_1 = __importDefault(require("../modals/Designation/Designation"));
// import Contact from '../modals/Contacts/Contact';
// import WorkExperience from '../modals/WorkExperience/WorkExperience';
// import Education from '../modals/Eduction/Education';
const ReasonForLeaving_1 = __importDefault(require("../modals/ReasonForLeaving/ReasonForLeaving"));
// Load Environment Variables
dotenv_1.default.config();
const port = process.env.PORT || 4000;
const app = (0, subserver_1.default)();
// Establish Associations
const establishAssociations = () => {
    // Candidate and Designation Association
    Designation_1.default.hasMany(Candidate_1.default, { foreignKey: 'designationId' });
    Candidate_1.default.belongsTo(Designation_1.default, { foreignKey: 'designationId' });
    // // Candidate and Contact Association
    // Candidate.hasMany(Contact, { foreignKey: 'candidateId' });
    // Contact.belongsTo(Candidate, { foreignKey: 'candidateId' });
    // // Candidate and WorkExperience Association
    // Candidate.hasOne(WorkExperience, { foreignKey: 'candidateId' });
    // WorkExperience.belongsTo(Candidate, { foreignKey: 'candidateId' });
    // // Candidate and Education Association
    // Candidate.hasOne(Education, { foreignKey: 'candidateId' });
    // Education.belongsTo(Candidate, { foreignKey: 'candidateId' });
    // Candidate and ReasonsForLeaving Association
    Candidate_1.default.hasMany(ReasonForLeaving_1.default, { foreignKey: 'candidateId' });
    ReasonForLeaving_1.default.belongsTo(Candidate_1.default, { foreignKey: 'candidateId' });
};
// Sync Database
const syncDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Establish associations
        establishAssociations();
        // Sync all models
        yield dbconfig_1.default.sync(); // Use { force: true } if you want to drop and recreate tables
        console.log('Database synced successfully!');
        // Start the server
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    }
    catch (error) {
        console.error('Error syncing database:', error.message);
    }
});
syncDatabase();
