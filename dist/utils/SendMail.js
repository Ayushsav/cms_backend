"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SendMail = ({ send_to, subject, message }) => {
    try {
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
        transporter.sendMail(option);
    }
    catch (error) {
        console.log(error.message);
    }
};
exports.default = SendMail;
