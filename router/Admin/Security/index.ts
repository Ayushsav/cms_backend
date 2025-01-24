import express from "express";
import securityctr from "../../../controller/SecurityController/SecurityCtr";

const securityRouter = express.Router();

securityRouter.post("/create", securityctr.createsecurity);
securityRouter.get("/fetch", securityctr.fetchsecurity);
securityRouter.put("/update/:id", securityctr.updatesecurity);
securityRouter.delete("/remove/:id", securityctr.removesecurity);

export default securityRouter;
