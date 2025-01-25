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
const ReasonSaveAnswer_1 = __importDefault(require("../../modals/ReasonSaveAnswer/ReasonSaveAnswer"));
const sequelize_1 = require("sequelize");
const ReasonSaveAnswerCtr = {
    create: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { candidateId, questionId, answer } = req.body;
            console.log("candidateId", candidateId);
            console.log("questionId", questionId);
            console.log("answer", answer);
            if (questionId.length !== answer.length) {
                res.status(400);
                throw new Error("questionId and answer arrays must have the same length.");
            }
            // Prepare the data for bulk insert
            const responseData = questionId.map((qid, index) => ({
                candidateId: parseInt(candidateId, 10), // Ensure `candidateId` is an integer
                questionId: qid,
                answer: answer[index],
            }));
            // Check if the same candidate with the same question ID and answer is already present
            const existingAnswers = yield ReasonSaveAnswer_1.default.findAll({
                where: {
                    [sequelize_1.Op.or]: responseData.map((data) => ({
                        candidateId: data.candidateId,
                        questionId: data.questionId,
                        answer: data.answer,
                    })),
                },
            });
            if (existingAnswers.length > 0) {
                res.status(400);
                throw new Error("You have already submitted these answers.");
            }
            const reasonSaveAnswer = yield ReasonSaveAnswer_1.default.bulkCreate(responseData);
            if (!reasonSaveAnswer) {
                res.status(400);
                throw new Error("Bad Request");
            }
            res.status(200).json({
                success: true,
                message: "Answers saved successfully",
                result: reasonSaveAnswer,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error === null || error === void 0 ? void 0 : error.message,
            });
        }
    })),
};
exports.default = ReasonSaveAnswerCtr;
