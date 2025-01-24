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
const ReasonForLeaving_1 = __importDefault(require("../../modals/ReasonForLeaving/ReasonForLeaving"));
const ReasonCtr = {
    //   create reason ctr
    createReasonctr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const additem = yield ReasonForLeaving_1.default.create({
                reason: req.body.reason,
                candidateId: 0,
            });
            if (!additem) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND);
                throw new Error("Reason Not Found");
            }
            return res
                .status(http_status_codes_1.StatusCodes.OK)
                .json({ message: "Reason Created", success: true });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
    //fetch reason Ctr
    fetchReasonCtr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const fetchitmes = yield ReasonForLeaving_1.default.findAll();
            if (!fetchitmes) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND);
                throw new Error("");
            }
            return res
                .status(http_status_codes_1.StatusCodes.OK)
                .json({ message: "", success: true, result: fetchitmes });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
    //   remove reson ctr
    removeReasonCtr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const removeitem = yield ReasonForLeaving_1.default.findByPk(req.params.id);
            if (!removeitem) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND);
                throw new Error("");
            }
            else {
                yield removeitem.destroy();
            }
            return res
                .status(http_status_codes_1.StatusCodes.OK)
                .json({ message: "Reason removed successfully", success: true });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
    //   edit reason ctr
    updateReasonCtr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const checkitems = yield ReasonForLeaving_1.default.findByPk(req.params.id);
            if (!checkitems) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST);
                throw new Error("");
            }
            yield checkitems.update({ reason: req.body.reason });
            return res
                .status(http_status_codes_1.StatusCodes.OK)
                .json({ message: "updated successfully", success: true });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
};
exports.default = ReasonCtr;
