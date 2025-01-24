import express from "express";
import DesignationCtr from "../../../controller/DesignationController/DesignationCtr";
import verifyToken from "../../../middleware/auth/Verifytoken";
const designationRouter = express.Router();

designationRouter.post("/create-designation",verifyToken, DesignationCtr.createdesignationctr);
designationRouter.get("/fetch-designation", DesignationCtr.fetchdesignationCtr);
designationRouter.delete("/delete-designation/:id",verifyToken, DesignationCtr.reomvedesignationCtr);
designationRouter.put("/update-designation/:id",verifyToken, DesignationCtr.editdesignationCtr);


export default designationRouter;
