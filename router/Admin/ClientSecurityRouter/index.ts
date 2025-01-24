import express from "express";
import clientsecurityctr from "../../../controller/ClientSecurityCtr/ClientSecurityCtr";
import verifyToken from "../../../middleware/auth/Verifytoken";

const clientsecurityRouter = express.Router();

clientsecurityRouter.post("/create",verifyToken, clientsecurityctr.setSecurityQueAnsCtr);
clientsecurityRouter.post("/check",clientsecurityctr.checkSecurityQueAnsCtr);
clientsecurityRouter.post("/verify",clientsecurityctr.verifySecurityQueAnsCtr)
clientsecurityRouter.get("/fetch");
clientsecurityRouter.put("/edit");
clientsecurityRouter.delete("/remove");

export default clientsecurityRouter;
