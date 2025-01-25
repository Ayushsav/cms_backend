"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ClientCtr_1 = __importDefault(require("../../../controller/ClientController/ClientCtr"));
const Verifytoken_1 = __importDefault(require("../../../middleware/auth/Verifytoken"));
let ClientRouter = express_1.default.Router();
ClientRouter.post("/create-client", Verifytoken_1.default, ClientCtr_1.default.createclientctr);
ClientRouter.get("/fetch-client", ClientCtr_1.default.fetchclientctr);
ClientRouter.delete("/remove-client/:id", ClientCtr_1.default.removeclientctr);
ClientRouter.put("/edit-client/:id", ClientCtr_1.default.editclientctr);
ClientRouter.get("/fetch-hasanswer", Verifytoken_1.default, ClientCtr_1.default.hasAnswer);
exports.default = ClientRouter;
