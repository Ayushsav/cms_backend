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
const Candidate_1 = __importDefault(require("../../modals/Candidate/Candidate"));
const sequelize_1 = require("sequelize");
const SendWhatsAppMessage_1 = __importDefault(require("../../utils/SendWhatsAppMessage"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Modify the function to not rely on `req` and `res`
const sendExitInterviewMessage = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(tenDaysAgo.getDate());
        // Find candidates with empty reasons and no recent reminders
        const candidates = yield Candidate_1.default.findAll({
            attributes: ["id", "name", "whatsappNumber", "lastReminderSent"],
            where: {
                [sequelize_1.Op.or]: [
                    { lastReminderSent: { [sequelize_1.Op.lt]: tenDaysAgo } },
                ],
                [sequelize_1.Op.and]: [
                    sequelize_1.Sequelize.literal(`NOT EXISTS (SELECT 1 FROM \`ReasonSaveAnswer\` WHERE \`ReasonSaveAnswer\`.\`candidateId\` = \`Candidate\`.\`id\`)`),
                ],
            },
        });
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
    }
    catch (error) {
        console.error("WhatsApp message send error:", error);
    }
});
exports.default = sendExitInterviewMessage;
