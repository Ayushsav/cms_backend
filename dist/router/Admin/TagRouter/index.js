"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TagCtr_1 = __importDefault(require("../../../controller/TagsController/TagCtr"));
const upload_1 = __importDefault(require("../../../middleware/upload"));
const Verifytoken_1 = __importDefault(require("../../../middleware/auth/Verifytoken"));
const tagRouter = (0, express_1.Router)();
// tag Router
tagRouter.post("/create-tag", Verifytoken_1.default, TagCtr_1.default.createtagCtr);
tagRouter.get("/fetch-tag", Verifytoken_1.default, TagCtr_1.default.fetchtagsCtr);
tagRouter.delete("/remove-tag/:id", Verifytoken_1.default, TagCtr_1.default.removetagsCtr);
tagRouter.put("/update-tag/:id", Verifytoken_1.default, TagCtr_1.default.updatetagctr);
tagRouter.post("/import-tags", Verifytoken_1.default, upload_1.default.single("file"), TagCtr_1.default.importTagsCtr);
tagRouter.get("/download-tag-template", TagCtr_1.default.returntagsCsvFile);
exports.default = tagRouter;
