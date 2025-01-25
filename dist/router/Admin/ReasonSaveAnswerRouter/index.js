"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ReasonSaveAnswereCtr_1 = __importDefault(require("../../../controller/ReasonSaveAnswereController/ReasonSaveAnswereCtr"));
const ReasonSaveAnswerRouter = express_1.default.Router();
ReasonSaveAnswerRouter.post("/create", ReasonSaveAnswereCtr_1.default.create);
exports.default = ReasonSaveAnswerRouter;
