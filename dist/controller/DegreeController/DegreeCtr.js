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
const http_status_codes_1 = require("http-status-codes");
const Degree_1 = __importDefault(require("../../modals/DegreeProgram/Degree"));
const sequelize_1 = require("sequelize");
const dbconfig_1 = __importDefault(require("../../dbconfig/dbconfig"));
const DegreeCtr = {
    // create Degree
    createDegreeCtr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, level, duration } = req.body;
            if (!name || !level || !duration) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST);
                throw new Error("Please provide all required fields");
            }
            // check Degree existance by name
            const DegreeExists = yield Degree_1.default.findOne({ where: { name } });
            if (DegreeExists) {
                res.status(http_status_codes_1.StatusCodes.CONFLICT);
                throw new Error("Degree Already Exists");
            }
            const response = yield Degree_1.default.create({
                name,
                level,
                duration,
            });
            return res
                .status(http_status_codes_1.StatusCodes.CREATED)
                .json({ message: "Degree created successfully", success: true, result: response });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
    //   fetch Degree ctr
    fetchDegreeCtr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield Degree_1.default.findAll();
            if (!response) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND);
                throw new Error("Degree Not Found");
            }
            return res
                .status(http_status_codes_1.StatusCodes.OK)
                .json({ message: "Degree fetched successfully", success: true, result: response });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
    fetchDegreeByIdCtr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const response = yield Degree_1.default.findByPk(id);
            if (!response) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND);
                throw new Error("Degree Not Found");
            }
            return res
                .status(http_status_codes_1.StatusCodes.OK)
                .json({ message: "Degree fetched successfully", success: true, result: response });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
    fetchDegreeByNameCtr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name } = req.body;
            // Convert the input name to lowercase to ensure case-insensitive comparison
            const searchName = name.toLowerCase();
            // Perform a case-insensitive search using `LOWER` and `Op.like` in MySQL
            const response = yield Degree_1.default.findAll({
                where: dbconfig_1.default.where(dbconfig_1.default.fn('LOWER', dbconfig_1.default.col('name')), // Convert the 'name' column to lowercase
                { [sequelize_1.Op.like]: `%${searchName}%` } // Use LIKE for partial matching
                ),
            });
            if (!response) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND);
                throw new Error("Degree Not Found");
            }
            return res
                .status(http_status_codes_1.StatusCodes.OK)
                .json({ message: "Degree fetched successfully", success: true, result: response });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
    updateDegreeCtr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { name, level, duration } = req.body;
            if (!name || !level || !duration) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST);
                throw new Error("Please provide all required fields");
            }
            const checkDegree = yield Degree_1.default.findByPk(id);
            if (!checkDegree) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND);
                throw new Error("Degree Not Found");
            }
            const degreeExists = yield Degree_1.default.findOne({
                where: {
                    name,
                    level,
                    duration,
                    id: { [sequelize_1.Op.ne]: id } // Ensure the degree with the same name, level, and duration but different id
                }
            });
            if (degreeExists) {
                res.status(http_status_codes_1.StatusCodes.CONFLICT);
                throw new Error("Degree Already Exists");
            }
            yield checkDegree.update({ name, level, duration });
            return res
                .status(http_status_codes_1.StatusCodes.OK)
                .json({ message: "Degree updated successfully", success: true, result: checkDegree });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
    deleteDegreeCtr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const response = yield Degree_1.default.destroy({ where: { id } });
            if (!response) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND);
                throw new Error("Degree Not Found");
            }
            return res
                .status(http_status_codes_1.StatusCodes.OK)
                .json({ message: "Degree deleted successfully", success: true, result: response });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
};
exports.default = DegreeCtr;
