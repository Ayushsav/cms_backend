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
const SecurityQuestions_1 = __importDefault(require("../../modals/SecurityQuestions"));
const http_status_codes_1 = require("http-status-codes");
const securityctr = {
    //  add clien security data
    createsecurity: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let { questionText } = req.body;
            const addsecurity = yield SecurityQuestions_1.default.create({
                questionText,
            });
            if (!addsecurity) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND);
                throw new Error("Bad Request");
            }
            return res.status(http_status_codes_1.StatusCodes.CREATED).json({
                message: "added successfully",
                success: true,
                result: addsecurity,
            });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
    //   fetch   security data
    fetchsecurity: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const fetchsecurity = yield SecurityQuestions_1.default.findAll();
            if (!fetchsecurity) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND);
                throw new Error("Bad Request");
            }
            return res.status(http_status_codes_1.StatusCodes.CREATED).json({
                message: "fetch data successfully",
                success: true,
                result: fetchsecurity,
            });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
    //   remove  security data
    removesecurity: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const removeSecurity = yield SecurityQuestions_1.default.findByPk(req.params.id);
            if (!removeSecurity) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND);
                throw new Error("Bad Request");
            }
            else {
                yield removeSecurity.destroy();
            }
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "remove security successfully",
                result: removeSecurity,
                success: true,
            });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
    //   edity  security data
    updatesecurity: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let { questionText } = req.body;
            const updateSecurity = yield SecurityQuestions_1.default.findByPk(req.params.id);
            if (!updateSecurity) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND);
                throw new Error("Bad Request");
            }
            else {
                yield updateSecurity.update({ questionText });
            }
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "remove security successfully",
                result: updateSecurity,
                success: true,
            });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
};
exports.default = securityctr;
