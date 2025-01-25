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
const ReasonAnswer_1 = __importDefault(require("../../modals/ReasonAnswer/ReasonAnswer"));
const ReasonCtr = {
    //   create reason ctr
    createReasonctr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { reason, option } = req.body;
            const data = yield option.map((item) => {
                return item;
            });
            console.log("////", data);
            console.log(reason, option);
            const additem = yield ReasonForLeaving_1.default.create({
                reason,
            });
            if (!additem) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND);
                throw new Error("Reason Not Found");
            }
            5;
            const reasonAnswers = option.map((optionText) => ({
                reason_id: additem.id, // Associate the reason ID to the options
                Reason_answer: optionText,
            }));
            // Bulk create the ReasonAnswer entries
            yield ReasonAnswer_1.default.bulkCreate(reasonAnswers);
            //find reason with answer
            const reasonWithAnswer = yield ReasonForLeaving_1.default.findOne({
                where: { id: additem.id },
                include: {
                    model: ReasonAnswer_1.default,
                    attributes: ["id", "Reason_answer"],
                },
            });
            return res
                .status(http_status_codes_1.StatusCodes.OK)
                .json({ message: "Reason Created", success: true, result: reasonWithAnswer });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
    //fetch reason Ctr
    fetchReasonCtr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const fetchItems = yield ReasonForLeaving_1.default.findAll({
                include: {
                    model: ReasonAnswer_1.default,
                    attributes: ["id", "Reason_answer"],
                },
                attributes: ["id", "reason"], // Fetch only required attributes
            });
            if (!fetchItems) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND);
                throw new Error("Reason not found");
            }
            // const formattedResult = fetchItems.map((item) => ({
            //   id: item.id,
            //   reason: item.reason,
            //   reasonAnswers:
            //     item.ReasonAnswers?.map(
            //       (answer: {Reason_answer: any}) => answer.Reason_answer
            //     ) || [],
            // }));
            return res
                .status(http_status_codes_1.StatusCodes.OK)
                .json({ message: "", success: true, result: fetchItems });
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
                throw new Error("Reason not found ");
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
                throw new Error("Reason not found ");
            }
            yield checkitems.update({ reason: req.body.reason });
            //find reason with answer
            const reasonWithAnswer = yield ReasonForLeaving_1.default.findOne({
                where: { id: checkitems.id },
                include: {
                    model: ReasonAnswer_1.default,
                    attributes: ["id", "Reason_answer"],
                },
            });
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "updated successfully",
                success: true,
                result: reasonWithAnswer,
            });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
};
exports.default = ReasonCtr;
