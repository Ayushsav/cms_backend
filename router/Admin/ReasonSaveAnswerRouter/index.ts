import express from "express";
import ReasonSaveAnswerCtr from "../../../controller/ReasonSaveAnswereController/ReasonSaveAnswereCtr";

const ReasonSaveAnswerRouter = express.Router();

ReasonSaveAnswerRouter.post("/create", ReasonSaveAnswerCtr.create);

export default ReasonSaveAnswerRouter;
