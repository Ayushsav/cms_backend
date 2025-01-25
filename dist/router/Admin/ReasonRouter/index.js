"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ReasonCtr_1 = __importDefault(require("../../../controller/ReasonController/ReasonCtr"));
const ReasonRouter = express_1.default.Router();
ReasonRouter.post("/create-reason", ReasonCtr_1.default.createReasonctr);
ReasonRouter.get("/get-reason", ReasonCtr_1.default.fetchReasonCtr);
ReasonRouter.put("/update-reason/:id", ReasonCtr_1.default.updateReasonCtr);
ReasonRouter.delete("/delete-reason/:id", ReasonCtr_1.default.removeReasonCtr);
exports.default = ReasonRouter;
