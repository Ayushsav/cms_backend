"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ClientSecurityCtr_1 = __importDefault(require("../../../controller/ClientSecurityCtr/ClientSecurityCtr"));
const Verifytoken_1 = __importDefault(require("../../../middleware/auth/Verifytoken"));
const clientsecurityRouter = express_1.default.Router();
clientsecurityRouter.post("/create", Verifytoken_1.default, ClientSecurityCtr_1.default.setSecurityQueAnsCtr);
clientsecurityRouter.post("/check", ClientSecurityCtr_1.default.checkSecurityQueAnsCtr);
clientsecurityRouter.post("/verify", ClientSecurityCtr_1.default.verifySecurityQueAnsCtr);
clientsecurityRouter.get("/fetch");
clientsecurityRouter.put("/edit");
clientsecurityRouter.delete("/remove");
exports.default = clientsecurityRouter;
