"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CandidateCtr_1 = __importDefault(require("../../controller/CandidateController/CandidateCtr"));
const upload_1 = __importDefault(require("../../middleware/upload"));
const candidateRouter = express_1.default.Router();
candidateRouter.post("/create-candidate", CandidateCtr_1.default.createCandidatectr);
candidateRouter.get("/fetch-candidate", CandidateCtr_1.default.fetchCandidateCtr);
candidateRouter.delete("/delete-candidate/:id", CandidateCtr_1.default.reomveCandidateCtr);
candidateRouter.put("/update-candidate/:id", CandidateCtr_1.default.editCandidateCtr);
candidateRouter.post("/upload-csv-candidate", upload_1.default.single("file"), CandidateCtr_1.default.importCandidates);
candidateRouter.get("/download-csv-candidate", CandidateCtr_1.default.returnCandidateCsvFile);
exports.default = candidateRouter;
