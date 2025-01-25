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
const dotenv_1 = __importDefault(require("dotenv"));
const subserver_1 = __importDefault(require("./subserver/subserver"));
const dbconfig_1 = __importDefault(require("../dbconfig/dbconfig"));
const Syncdatabase_1 = __importDefault(require("../middleware/Syncdatabase"));
var cron = require("node-cron");
const index_1 = __importDefault(require("../Integration/WhatsApp/index")); // Correct the path as needed
dotenv_1.default.config();
const port = process.env.PORT || 4000;
const app = (0, subserver_1.default)();
dbconfig_1.default
    .sync()
    .then(() => {
    console.log("connection established");
})
    .catch((error) => {
    console.error(error.message);
});
const db = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, Syncdatabase_1.default)();
        console.log("connection established");
    }
    catch (error) {
        console.error(error.message);
    }
});
db();
// Schedule the job to run every day at 13:35 (1:35 PM)
cron.schedule("05 16 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Running scheduled reminder job...");
    try {
        (0, index_1.default)();
    }
    catch (error) {
        console.error("Error during reminder job execution:", error);
    }
}));
// cron.schedule("* * * * *", () => {
//   console.log("running a task every minute");
//   sendExitInterviewMessage();
// });
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
