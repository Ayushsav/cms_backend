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
const Education_1 = __importDefault(require("../../modals/Eduction/Education"));
const http_status_codes_1 = require("http-status-codes");
const EducationCtr = {
    // create Education ctr
    createEducationctr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { ugCourse, pgCourse, postPgCourse, candidateId = 5 } = req.body;
            const response = yield Education_1.default.create({
                ugCourse,
                pgCourse,
                postPgCourse,
                candidateId,
            });
            if (!response) {
                res.status;
                throw new Error("education Not Found");
            }
            return res.status(http_status_codes_1.StatusCodes.CREATED).json({
                message: "education created successfully",
                success: true,
                result: response,
            });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
    //   fetch education ctr
    fetchEducationctr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield Education_1.default.findAll();
            if (!response) {
                throw new Error("education not found");
            }
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "education fetched successfully",
                success: true,
                result: response,
            });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
    //   update education ctr
    updateEducationctr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { ugCourse, pgCourse, postPgCourse, candidateId } = req.body;
            const response = yield Education_1.default.update({
                ugCourse,
                pgCourse,
                postPgCourse,
                candidateId,
            }, {
                where: {
                    id: req.params.id,
                },
            });
            if (!response) {
                throw new Error("education not found");
            }
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "education updated successfully",
                success: true,
            });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
    //   delete education ctr
    deleteEducationctr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield Education_1.default.destroy({
                where: {
                    id: req.params.id,
                },
            });
            if (!response) {
                throw new Error("education not found");
            }
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "education deleted successfully",
                success: true,
            });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
};
exports.default = EducationCtr;
