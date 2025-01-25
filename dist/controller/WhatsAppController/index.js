"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_status_codes_1 = require("http-status-codes");
const Candidate_1 = __importDefault(require("../../modals/Candidate/Candidate"));
const SendWhatsAppMessage_1 = __importDefault(require("../../utils/SendWhatsAppMessage"));
dotenv_1.default.config();
const WhatsAppCtr = {
    //   SignIn Ctr
    sendMessageCtr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.body;
            const candidate = yield Candidate_1.default.findOne({
                where: {
                    id
                },
                attributes: ["id", "name", "whatsappNumber", "lastReminderSent"],
            });
            if (!candidate) {
                return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                    message: "Candidate not found"
                });
            }
            // Call the WhatsApp API to send a message
            console.log("Sending message to candidate:", candidate.whatsappNumber);
            const user = {
                name: candidate.name,
                url: `${process.env.FRONTEND_URL}/reason-leaving-job/${candidate.id}`,
                phone: candidate.whatsappNumber,
            };
            yield (0, SendWhatsAppMessage_1.default)(user);
            // Update the `lastReminderSent` field
            candidate.lastReminderSent = new Date();
            yield candidate.save();
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "Message sent successfully",
                success: true,
            });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
    sendMultipleMessageCtr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { ids } = req.body;
            const candidates = yield Candidate_1.default.findAll({
                where: {
                    id: ids
                },
                attributes: ["id", "name", "whatsappNumber", "lastReminderSent"],
            });
            if (!candidates) {
                return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                    message: "Candidate not found"
                });
            }
            for (const candidate of candidates) {
                // Call the WhatsApp API to send a message
                console.log("Sending message to candidate:", candidate.whatsappNumber);
                const user = {
                    name: candidate.name,
                    url: `${process.env.FRONTEND_URL}/reason-leaving-job/${candidate.id}`,
                    phone: candidate.whatsappNumber,
                };
                yield (0, SendWhatsAppMessage_1.default)(user);
                // Update the `lastReminderSent` field
                candidate.lastReminderSent = new Date();
                yield candidate.save();
            }
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "Message sent successfully",
                success: true,
            });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
};
exports.default = WhatsAppCtr;
