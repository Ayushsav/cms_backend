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
const Region_1 = __importDefault(require("../../modals/Region/Region"));
const http_status_codes_1 = require("http-status-codes");
const RegionCtr = {
    createRegionctr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { Name } = req.body;
            // check User existance
            // const userExists: number | unknown = await User.findByPk(req.user);
            // if (!userExists) {
            //   res.status(StatusCodes.UNAUTHORIZED);
            //   throw new Error("User Not Found Please Login !");
            // }
            const additmes = yield Region_1.default.create({ Name });
            if (!additmes) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND);
                throw new Error("region Not Found");
            }
            return res.status(http_status_codes_1.StatusCodes.CREATED).json({
                message: "region created successfully",
                result: additmes,
                success: true,
            });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
    //   fetch region ctr
    fetchregionctr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // check User existance
            // const userExists: number | unknown = await User.findByPk(req.user);
            // if (!userExists) {
            //   res.status(StatusCodes.UNAUTHORIZED);
            //   throw new Error("User Not Found Please Login !");
            // }
            let fetchitems = yield Region_1.default.findAll();
            if (!fetchitems) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND);
                throw new Error("region Not Found");
            }
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "region fetch succesfully",
                success: true,
                result: fetchitems,
            });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
    //   remove items ctr
    removeregionctr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // check use existance
            // const userExists: number | unknown = await User.findByPk(req.user);
            // if (!userExists) {
            //   res.status(StatusCodes.UNAUTHORIZED);
            //   throw new Error("User Not Found Please Login !");
            // }
            const removeitems = yield Region_1.default.findByPk(req.params.id);
            if (!removeitems) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND);
                throw new Error("");
            }
            else {
                yield removeitems.destroy();
            }
            return res
                .status(http_status_codes_1.StatusCodes.OK)
                .json({ message: "remove item successfully", success: true });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
    //   update itmes ctr
    editregionctr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // check use existance
            // const userExists: number | unknown = await User.findByPk(req.user);
            // if (!userExists) {
            //   res.status(StatusCodes.UNAUTHORIZED);
            //   throw new Error("User Not Found Please Login !");
            // }
            let checkRegion = yield Region_1.default.findByPk(req.params.id);
            if (!checkRegion) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND);
                throw new Error("");
            }
            else {
                yield checkRegion.update({ Name: req.body.Name });
            }
            return res
                .status(http_status_codes_1.StatusCodes.OK)
                .json({ message: "updated region successfully", success: true, result: checkRegion });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
};
exports.default = RegionCtr;
