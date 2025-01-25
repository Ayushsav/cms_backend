"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserRouter_1 = __importDefault(require("./UserRouter"));
const CandidateRouter_1 = __importDefault(require("./Admin/CandidateRouter"));
const DesignationRouter_1 = __importDefault(require("./Admin/DesignationRouter"));
const ReasonRouter_1 = __importDefault(require("./Admin/ReasonRouter"));
const EducationRouter_1 = __importDefault(require("./Admin/EducationRouter"));
const TagRouter_1 = __importDefault(require("./Admin/TagRouter"));
const ClientRouter_1 = __importDefault(require("./Admin/ClientRouter/ClientRouter"));
const RegionRouter_1 = __importDefault(require("./Admin/RegionRouter/RegionRouter"));
const DegreeRouter_1 = __importDefault(require("./Admin/DegreeRouter"));
const ClientSecurityRouter_1 = __importDefault(require("./Admin/ClientSecurityRouter"));
const index_1 = __importDefault(require("./Admin/Security/index"));
const ReasonSaveAnswerRouter_1 = __importDefault(require("./Admin/ReasonSaveAnswerRouter"));
const AnalyticalRouter_1 = __importDefault(require("./Admin/AnalyticalRouter"));
const DashboardRouter_1 = __importDefault(require("./Admin/DashboardRouter"));
const Whatsapp_1 = __importDefault(require("./Admin/Whatsapp"));
const indexRouter = express_1.default.Router();
indexRouter.use("/user", UserRouter_1.default);
indexRouter.use("/designation", DesignationRouter_1.default);
indexRouter.use("/candidate", CandidateRouter_1.default);
indexRouter.use("/reason", ReasonRouter_1.default);
indexRouter.use("/education/", EducationRouter_1.default);
indexRouter.use("/tag", TagRouter_1.default);
indexRouter.use("/client", ClientRouter_1.default);
indexRouter.use("/region", RegionRouter_1.default);
indexRouter.use("/degrees", DegreeRouter_1.default);
indexRouter.use("/client-security", ClientSecurityRouter_1.default);
indexRouter.use("/security", index_1.default);
indexRouter.use("/v1", ReasonSaveAnswerRouter_1.default);
indexRouter.use("/analytical", AnalyticalRouter_1.default);
indexRouter.use("/dashboard", DashboardRouter_1.default);
indexRouter.use("/whatsapp", Whatsapp_1.default);
exports.default = indexRouter;
