"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DegreeCtr_1 = __importDefault(require("../../../controller/DegreeController/DegreeCtr"));
let DegreeRouter = express_1.default.Router();
DegreeRouter.post("/create-degree", DegreeCtr_1.default.createDegreeCtr);
DegreeRouter.get("/fetch-degree", DegreeCtr_1.default.fetchDegreeCtr);
DegreeRouter.get("/fetch-degree/:id", DegreeCtr_1.default.fetchDegreeByIdCtr);
DegreeRouter.get("/fetch-degree-name", DegreeCtr_1.default.fetchDegreeByNameCtr);
DegreeRouter.put("/update-degree/:id", DegreeCtr_1.default.updateDegreeCtr);
DegreeRouter.delete("/delete-degree/:id", DegreeCtr_1.default.deleteDegreeCtr);
exports.default = DegreeRouter;
