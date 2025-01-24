import express from "express";
import ReasonCtr from "../../../controller/ReasonController/ReasonCtr";

const ReasonRouter = express.Router();

ReasonRouter.post("/create-reason", ReasonCtr.createReasonctr);
ReasonRouter.get("/get-reason", ReasonCtr.fetchReasonCtr);
ReasonRouter.put("/update-reason/:id", ReasonCtr.updateReasonCtr);
ReasonRouter.delete("/delete-reason/:id", ReasonCtr.removeReasonCtr);
export default ReasonRouter;
