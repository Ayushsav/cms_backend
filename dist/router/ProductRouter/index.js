"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ProductCtr_1 = __importDefault(require("../../controller/ProductController/ProductCtr"));
const productRouter = express_1.default.Router();
productRouter.post("/add-product", ProductCtr_1.default.createProductCtr);
productRouter.get("/fetch-product", ProductCtr_1.default.getProductCtr);
exports.default = productRouter;
