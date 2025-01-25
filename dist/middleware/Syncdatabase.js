"use strict";
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
const Candidate_1 = __importDefault(require("../modals/Candidate/Candidate"));
// import CandidateReasons from "../modals/CandidateReasons/CandidateReasons";
const CandidateTags_1 = __importDefault(require("../modals/CandidateTags/CandidateTags"));
const Client_1 = __importDefault(require("../modals/Client/Client"));
const Degree_1 = __importDefault(require("../modals/DegreeProgram/Degree"));
const Designation_1 = __importDefault(require("../modals/Designation/Designation"));
const Education_1 = __importDefault(require("../modals/Eduction/Education"));
const ReasonForLeaving_1 = __importDefault(require("../modals/ReasonForLeaving/ReasonForLeaving"));
const Region_1 = __importDefault(require("../modals/Region/Region"));
const Tag_1 = __importDefault(require("../modals/Tag/Tag"));
const Token_1 = __importDefault(require("../modals/Token/Token"));
const User_1 = __importDefault(require("../modals/User/User"));
const ClientTags_1 = __importDefault(require("../modals/ClientTags"));
const index_1 = __importDefault(require("../modals/SecurityQuestions/index"));
const index_2 = __importDefault(require("../modals/UserSecurityAnswer/index"));
const ReasonAnswer_1 = __importDefault(require("../modals/ReasonAnswer/ReasonAnswer"));
const ReasonSaveAnswer_1 = __importDefault(require("../modals/ReasonSaveAnswer/ReasonSaveAnswer"));
function syncdatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        // await ClientSecurity.sync();
        yield User_1.default.sync();
        yield Token_1.default.sync();
        yield Tag_1.default.sync();
        yield ReasonForLeaving_1.default.sync();
        yield Designation_1.default.sync();
        yield Region_1.default.sync();
        yield Candidate_1.default.sync();
        yield CandidateTags_1.default.sync();
        // await CandidateReasons.sync();
        yield Education_1.default.sync();
        yield Client_1.default.sync();
        yield Degree_1.default.sync();
        yield ClientTags_1.default.sync();
        yield index_1.default.sync();
        yield index_2.default.sync();
        yield ReasonAnswer_1.default.sync();
        yield ReasonSaveAnswer_1.default.sync();
    });
}
exports.default = syncdatabase;
