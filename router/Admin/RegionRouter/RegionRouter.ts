import express from "express";
import RegionCtr from "../../../controller/RegionController/RegionCtr";

const regionRouter = express.Router();

regionRouter.post("/create-region", RegionCtr.createRegionctr);
regionRouter.get("/fetch-region",RegionCtr.fetchregionctr);
regionRouter.delete("/remove-region/:id",RegionCtr.removeregionctr);
regionRouter.put("/update-region/:id",RegionCtr.editregionctr);

export default regionRouter;
