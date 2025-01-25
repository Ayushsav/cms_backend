"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const RegionCtr_1 = __importDefault(require("../../../controller/RegionController/RegionCtr"));
const regionRouter = express_1.default.Router();
regionRouter.post("/create-region", RegionCtr_1.default.createRegionctr);
regionRouter.get("/fetch-region", RegionCtr_1.default.fetchregionctr);
regionRouter.delete("/remove-region/:id", RegionCtr_1.default.removeregionctr);
regionRouter.put("/update-region/:id", RegionCtr_1.default.editregionctr);
exports.default = regionRouter;
