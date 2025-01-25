"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const EducationCtr_1 = __importDefault(require("../../../controller/EducationController/EducationCtr"));
const educationRouter = express_1.default.Router();
educationRouter.post("/create-education", EducationCtr_1.default.createEducationctr);
educationRouter.get("/get-education", EducationCtr_1.default.fetchEducationctr);
educationRouter.put("/update-education/:id", EducationCtr_1.default.updateEducationctr);
educationRouter.delete("/delete-education/:id", EducationCtr_1.default.deleteEducationctr);
exports.default = educationRouter;
