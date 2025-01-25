"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const SecurityCtr_1 = __importDefault(require("../../../controller/SecurityController/SecurityCtr"));
const securityRouter = express_1.default.Router();
securityRouter.post("/create", SecurityCtr_1.default.createsecurity);
securityRouter.get("/fetch", SecurityCtr_1.default.fetchsecurity);
securityRouter.put("/update/:id", SecurityCtr_1.default.updatesecurity);
securityRouter.delete("/remove/:id", SecurityCtr_1.default.removesecurity);
exports.default = securityRouter;
