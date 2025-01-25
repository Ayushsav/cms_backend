"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Verifytoken_1 = __importDefault(require("../../../middleware/auth/Verifytoken"));
const WhatsAppController_1 = __importDefault(require("../../../controller/WhatsAppController"));
const whatsappRouter = (0, express_1.Router)();
whatsappRouter.post("/send-message", Verifytoken_1.default, WhatsAppController_1.default.sendMessageCtr);
whatsappRouter.post("/send-multiple-message", Verifytoken_1.default, WhatsAppController_1.default.sendMultipleMessageCtr);
exports.default = whatsappRouter;
