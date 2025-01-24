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
const Product_1 = __importDefault(require("../../modals/Product/Product"));
const asyncHandler = require("express-async-handler");
const ProductCtr = {
    createProductCtr: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let { Candidate_Name, Resume_Title, Contact_Number, Email, Work_Exp, Current_Ctc, Salary, Current_Location, State, Region, UserId, } = req.body;
            const response = yield Product_1.default.create({
                Candidate_Name,
                Resume_Title,
                Contact_Number,
                Email,
                Work_Exp,
                Current_Ctc,
                Salary,
                Current_Location,
                State,
                Region,
                UserId,
            });
            if (!response) {
                res.status(400);
                throw new Error("Product Not Found");
            }
            return res.status(201).json({
                message: "Product created successfully",
                success: true,
            });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
    getProductCtr: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield Product_1.default.findAll();
            if (!response) {
                res.status(400);
                throw new Error("Product Not Found");
            }
            return res.status(200).json({
                message: "Product fetched successfully",
                success: true,
                data: response,
            });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
};
exports.default = ProductCtr;
