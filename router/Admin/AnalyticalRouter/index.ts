import express, {Request, Response} from "express";
import AnalyticalCtr from "../../../controller/AnalyticalController";
import verifyToken from "../../../middleware/auth/Verifytoken";
import answerCandidateController from "../../../controller/AnalyticalController/reason";

const analyticalRouter = express.Router();

analyticalRouter.get("/candidate-distribution",verifyToken, AnalyticalCtr.candidateDistribution);
analyticalRouter.get("/work-experience-analysis",verifyToken, AnalyticalCtr.workExperienceAnalysis);
analyticalRouter.get("/current-ctc-analysis",verifyToken, AnalyticalCtr.currentCTCAnalysis);
analyticalRouter.get("/geographical-distribution",verifyToken, AnalyticalCtr.geographicalDistribution);
analyticalRouter.get("/education-level-analysis",verifyToken, AnalyticalCtr.educationLevelAnalysis);
analyticalRouter.get("/client-analysis",verifyToken, AnalyticalCtr.clientStatusAnalysis);
analyticalRouter.get("/tag-analysis",verifyToken, AnalyticalCtr.tagAnalysis);
analyticalRouter.get("/candidate-age-distribution",verifyToken, AnalyticalCtr.candidateAgeDistribution);

analyticalRouter.get('/answers/distribution',verifyToken, answerCandidateController.getAnswerDistribution);
// analyticalRouter.get('/answers/combinations',verifyToken, answerCandidateController.getCommonAnswerCombinations);
analyticalRouter.get('/answers/demographics',verifyToken, answerCandidateController.getAnswersByDemographics);
// analyticalRouter.get('/answers/trends',verifyToken, answerCandidateController.getAnswerTrends);
analyticalRouter.get('/answers/candidate-stats',verifyToken, answerCandidateController.getCandidateStatsPerAnswer);
analyticalRouter.get('/answers/by-experience',verifyToken, answerCandidateController.getAnswersByExperience);


export default analyticalRouter;