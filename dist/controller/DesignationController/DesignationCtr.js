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
const Designation_1 = __importDefault(require("../../modals/Designation/Designation"));
const http_status_codes_1 = require("http-status-codes");
const DesignationCtr = {
    // create designation ctr
    createdesignationctr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { title } = req.body;
            // check User existance
            // const userExists: number | unknown = await User.findByPk(req.user);
            // if (!userExists) {
            //   res.status(404);
            //   throw new Error("User Not Found Please Login !");
            // }
            //check designation existance
            const checkdesignation = yield Designation_1.default.findOne({ where: { title } });
            if (checkdesignation) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST);
                throw new Error("Designation Already Exist");
            }
            const itemresp = yield Designation_1.default.create({
                title,
            });
            if (!itemresp) {
                res.status(400);
                throw new Error("Bad Request");
            }
            return res
                .status(http_status_codes_1.StatusCodes.OK)
                .json({ success: true, message: "designation created Successfully" });
        }
        catch (error) {
            throw new Error(error);
        }
    })),
    //   fetch designation ctr
    fetchdesignationCtr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // const userExists: string | any = await User.findByPk(req.user);
            // if (!userExists) {
            //   res.status(404);
            //   throw new Error("User Not Found Please Login !");
            // }
            const fetchitems = yield Designation_1.default.findAll();
            if (!fetchitems) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND);
                throw new Error("");
            }
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "Fetch designation Successfully",
                success: true,
                result: fetchitems,
            });
        }
        catch (error) {
            throw new Error(error);
        }
    })),
    //   remove designation ctr
    reomvedesignationCtr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // const userExists: string | any = await User.findByPk(req.user);
            // if (!userExists) {
            //   res.status(404);
            //   throw new Error("User Not Found Please Login !");
            // }
            const removeitem = yield Designation_1.default.findByPk(req.params.id);
            if (!removeitem) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND);
                throw new Error("Item not Found");
            }
            else {
                removeitem.destroy();
            }
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "designation items remove successfully",
                success: true,
            });
        }
        catch (error) {
            throw new Error(error);
        }
    })),
    //   edit desingation ctr
    editdesignationCtr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // const userExists: string | any = await User.findByPk(req.user);
            // if (!userExists) {
            //   res.status(404);
            //   throw new Error("User Not Found Please Login !");
            // }
            const checkDesigation = yield Designation_1.default.findByPk(req.params.id);
            if (!checkDesigation) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST);
                throw new Error("Bad Request");
            }
            //check if designation exist
            yield checkDesigation.update({ title: req.body.title });
            return res
                .status(http_status_codes_1.StatusCodes.OK)
                .json({ message: "Update designation succesfully", success: true });
        }
        catch (error) {
            throw new Error(error);
        }
    })),
};
exports.default = DesignationCtr;
