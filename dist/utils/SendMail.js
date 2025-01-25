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
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SendMail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ send_to, subject, message }) {
    try {
        console.log("send_to", send_to);
        console.log("subject", subject);
        console.log("message", message);
        if (!send_to || !subject || !message) {
            throw new Error("Missing required fields: send_to, subject, or message");
        }
        const transporter = nodemailer_1.default.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const option = {
            from: process.env.EMAIL_USER,
            to: send_to, // list of receivers
            subject: subject, // Subject line
            html: message, // html body
        };
        yield transporter.sendMail(option);
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.default = SendMail;
