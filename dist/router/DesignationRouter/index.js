"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DesignationCtr_1 = __importDefault(require("../../controller/DesignationController/DesignationCtr"));
const designationRouter = express_1.default.Router();
designationRouter.post("/create-designation", DesignationCtr_1.default.createdesignationctr);
designationRouter.get("/fetch-designation", DesignationCtr_1.default.fetchdesignationCtr);
designationRouter.delete("/delete-designation/:id", DesignationCtr_1.default.reomvedesignationCtr);
designationRouter.put("/update-designation/:id", DesignationCtr_1.default.editdesignationCtr);
exports.default = designationRouter;
