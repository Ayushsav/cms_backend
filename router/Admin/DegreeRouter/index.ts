import express from "express";
import DegreeCtr from "../../../controller/DegreeController/DegreeCtr";
let DegreeRouter = express.Router();

DegreeRouter.post("/create-degree", DegreeCtr.createDegreeCtr);
DegreeRouter.get("/fetch-degree", DegreeCtr.fetchDegreeCtr);
DegreeRouter.get("/fetch-degree/:id", DegreeCtr.fetchDegreeByIdCtr);
DegreeRouter.get("/fetch-degree-name", DegreeCtr.fetchDegreeByNameCtr);
DegreeRouter.put("/update-degree/:id", DegreeCtr.updateDegreeCtr);
DegreeRouter.delete("/delete-degree/:id", DegreeCtr.deleteDegreeCtr);

export default DegreeRouter;