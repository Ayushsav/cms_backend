"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DashboardController_1 = __importDefault(require("../../../controller/DashboardController"));
const Verifytoken_1 = __importDefault(require("../../../middleware/auth/Verifytoken"));
const dashboardRouter = express_1.default.Router();
dashboardRouter.get("/dashboard-data", Verifytoken_1.default, DashboardController_1.default.dashboardData);
dashboardRouter.get("/dashboard-data-1", Verifytoken_1.default, DashboardController_1.default.dashboardData1);
exports.default = dashboardRouter;
