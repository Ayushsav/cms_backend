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
const User_1 = __importDefault(require("../../modals/User/User"));
const http_status_codes_1 = require("http-status-codes");
const ClientSecurity_1 = __importDefault(require("../../modals/ClientSecurity/ClientSecurity"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const index_1 = __importDefault(require("../../modals/UserSecurityAnswer/index"));
const index_2 = __importDefault(require("../../modals/SecurityQuestions/index"));
const Token_1 = __importDefault(require("../../modals/Token/Token"));
const crypto_1 = __importDefault(require("crypto"));
const Client_1 = __importDefault(require("../../modals/Client/Client"));
const clientsecurityctr = {
    //  add clien security data
    setSecurityQueAnsCtr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Ensure the user exists
            const checkUser = yield User_1.default.findByPk(req.user.id);
            if (!checkUser) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND);
                throw new Error("User Not Found");
            }
            const { questionsAndAnswers } = req.body;
            if (!Array.isArray(questionsAndAnswers) ||
                questionsAndAnswers.length === 0) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST);
                throw new Error("Invalid input. Expected an array of question and answer pairs.");
            }
            for (const { questionId, answer } of questionsAndAnswers) {
                // Validate that the question exists in the SecurityQuestion table
                const securityQuestion = yield index_2.default.findByPk(questionId);
                if (!securityQuestion) {
                    throw new Error(`Security question with ID ${questionId} not found`);
                }
                // Hash the answer using bcrypt
                const hashedAnswer = yield bcryptjs_1.default.hash(answer, 10);
                // Check if the user already has an answer for this question
                const existingAnswer = yield index_1.default.findOne({
                    where: {
                        userId: req.user.id,
                        questionId,
                    },
                });
                if (existingAnswer) {
                    // If an answer exists, update it
                    existingAnswer.answerHash = hashedAnswer;
                    yield existingAnswer.save();
                }
                else {
                    // If no answer exists, create a new record
                    yield index_1.default.create({
                        userId: req.user.id,
                        questionId,
                        answerHash: hashedAnswer,
                    });
                }
            }
            // Send success response
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "Security questions and answers set successfully",
                success: true,
            });
        }
        catch (error) {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: (error === null || error === void 0 ? void 0 : error.message) || "Something went wrong",
            });
        }
    })),
    checkSecurityQueAnsCtr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Ensure the user exists
            const { Email } = req.body;
            console.log(Email, "email called");
            const checkUser = yield User_1.default.findOne({
                where: { Email },
            });
            if (!checkUser) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND);
                throw new Error("User Not Found");
            }
            //we need to send the questions of the user in response
            const Allquestions = yield index_1.default.findAll({
                where: { userId: checkUser.id },
                include: {
                    model: index_2.default,
                    as: "securityQuestion",
                },
                //exclude everything except id
                attributes: ["id"],
            });
            if (!Allquestions || Allquestions.length === 0) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND);
                throw new Error("No security questions found for this user");
            }
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "Security questions fetched successfully",
                success: true,
                result: Allquestions,
                email: Email,
            });
        }
        catch (error) {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: (error === null || error === void 0 ? void 0 : error.message) || "Something went wrong",
            });
        }
    })),
    verifySecurityQueAnsCtr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { Email, answers } = req.body; // `answers` contains questionId and answer pairs
            console.log(Email, "email called");
            // Check if the user exists
            const checkUser = yield User_1.default.findOne({
                where: { Email },
            });
            if (!checkUser) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND);
                throw new Error("User Not Found");
            }
            const userId = checkUser.id;
            // Iterate over answers and validate
            const validationResults = yield Promise.all(answers.map((answerObj) => __awaiter(void 0, void 0, void 0, function* () {
                const { questionId, answer } = answerObj;
                // Fetch the security answer record for the user and question
                const securityAnswerRecord = yield index_1.default.findOne({
                    where: { userId, questionId },
                    include: [
                        {
                            model: index_2.default,
                            as: "securityQuestion",
                        },
                    ],
                });
                if (!securityAnswerRecord) {
                    return {
                        questionId,
                        success: false,
                        message: "Security question not found for this user.",
                    };
                }
                // Compare provided answer hash with the stored hash
                const isAnswerValid = yield bcryptjs_1.default.compare(answer, securityAnswerRecord.answerHash);
                return {
                    questionId,
                    success: isAnswerValid,
                    message: isAnswerValid
                        ? "Answer validated successfully."
                        : "Answer is incorrect.",
                };
            })));
            // Check if all validations passed
            const allValid = validationResults.every((result) => result.success);
            if (allValid) {
                let resetToken = crypto_1.default.randomBytes(32).toString("hex") + checkUser.id;
                // Hash token before saving to DB
                const hashedToken = crypto_1.default
                    .createHash("sha256")
                    .update(resetToken)
                    .digest("hex");
                // Delete token if it exists in DB
                let token = yield Token_1.default.findOne({
                    where: { userId: checkUser.id },
                });
                if (token) {
                    yield token.destroy();
                }
                yield Token_1.default.create({
                    userId: checkUser.id,
                    token: hashedToken,
                    createdAt: new Date(),
                    expireAt: new Date(Date.now() + 30 * 60 * 1000), // Thirty minutes
                });
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    message: "All security answers verified successfully.",
                    success: true,
                    result: resetToken,
                });
            }
            else {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    message: "One or more security answers are incorrect.",
                    success: false,
                });
            }
        }
        catch (error) {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: (error === null || error === void 0 ? void 0 : error.message) || "Something went wrong",
            });
        }
    })),
    //   fetch  client security data
    fetchclientsecurity: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const fetchsecurity = yield ClientSecurity_1.default.findAll();
            if (!fetchsecurity || fetchsecurity.length === 0) {
                return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                    message: "No security data found.",
                    success: false,
                });
            }
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "Security data fetched successfully.",
                success: true,
                result: fetchsecurity,
            });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
    //   remove client security data
    removeclientsecurity: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // remove security
            const removeSecurity = yield ClientSecurity_1.default.findByPk(req.params.id);
            if (!removeSecurity) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND);
                throw new Error("Security entry not found.");
            }
            yield removeSecurity.destroy();
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "Security entry removed successfully.",
                success: true,
            });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
    //   edity client security data
    updateclientsecurity: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { ClientId, QuestionId, Answer } = req.body;
        // Validate required fields
        if (!ClientId || !QuestionId || !Answer) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST);
            throw new Error("ClientId, QuestionId, and Answer are required.");
        }
        try {
            const updateSecurity = yield ClientSecurity_1.default.findByPk(req.params.id);
            if (!updateSecurity) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND);
                throw new Error("Security entry not found.");
            }
            yield updateSecurity.update({ ClientId, QuestionId, Answer });
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "Client Security entry updated successfully.",
                success: true,
                result: updateSecurity,
            });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
    // total client
    totalclientCount: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const checkUser = yield User_1.default.findByPk(req.user.id);
            if (!checkUser) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND);
                throw new Error("User Not Found");
            }
            const fetchcountclient = yield Client_1.default.findAndCountAll();
            if (!fetchcountclient) {
                res.status(400);
                throw new Error("bad Request");
            }
            return res.status(200).json({
                message: "fetch count successfully",
                result: fetchcountclient,
                success: true,
            });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
};
exports.default = clientsecurityctr;
