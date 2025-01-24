import express, {Request, Response} from "express";
import CandidateCtr from "../../../controller/CandidateController/CandidateCtr";
import upload from "../../../middleware/upload";
import verifyToken from "../../../middleware/auth/Verifytoken";
const candidateRouter = express.Router();

candidateRouter.post("/create-candidate",verifyToken, CandidateCtr.createCandidatectr);
candidateRouter.get("/fetch-candidate",verifyToken, CandidateCtr.fetchCandidateCtr);
candidateRouter.delete("/delete-candidate/:id",verifyToken, CandidateCtr.reomveCandidateCtr);
candidateRouter.put("/update-candidate/:id",verifyToken, CandidateCtr.editCandidateCtr);
candidateRouter.post("/upload-csv-candidate",verifyToken, upload.single("file"), CandidateCtr.importCandidates);
candidateRouter.get("/download-csv-candidate", CandidateCtr.returnCandidateCsvFile);
candidateRouter.get("/fetch-candidate1",verifyToken, CandidateCtr.fetchCandidateCtr1);

export default candidateRouter;