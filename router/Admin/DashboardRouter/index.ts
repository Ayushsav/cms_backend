import express, {Request, Response} from "express";
import DashboardCtr from "../../../controller/DashboardController";
import verifyToken from "../../../middleware/auth/Verifytoken";

const dashboardRouter = express.Router();

dashboardRouter.get("/dashboard-data",verifyToken, DashboardCtr.dashboardData);
dashboardRouter.get("/dashboard-data-1",verifyToken, DashboardCtr.dashboardData1);

export default dashboardRouter;