import asyncHandler from "express-async-handler";
import { CustomRequest } from "../../typeReq/customReq";
import { Response } from "express";
import ReasonSaveAnswer from "../../modals/ReasonSaveAnswer/ReasonSaveAnswer";
import { Op } from "sequelize";

const ReasonSaveAnswerCtr = {
  create: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        const { candidateId, questionId, answer } = req.body;
        console.log("candidateId", candidateId);
        console.log("questionId", questionId);
        console.log("answer", answer);
        if (questionId.length !== answer.length) {
          res.status(400);
          throw new Error(
            "questionId and answer arrays must have the same length."
          );
        }

        // Prepare the data for bulk insert
        const responseData = questionId.map((qid: number, index: number) => ({
          candidateId: parseInt(candidateId, 10), // Ensure `candidateId` is an integer
          questionId: qid,
          answer: answer[index],
        }));

        // Check if the same candidate with the same question ID and answer is already present
        const existingAnswers = await ReasonSaveAnswer.findAll({
          where: {
            [Op.or]: responseData.map((data: { candidateId: any; questionId: any; answer: any; }) => ({
              candidateId: data.candidateId,
              questionId: data.questionId,
              answer: data.answer,
            })),
          },
        });

        if (existingAnswers.length > 0) {
          res.status(400);
          throw new Error("You have already submitted these answers.");
        }

        const reasonSaveAnswer = await ReasonSaveAnswer.bulkCreate(responseData);

        if (!reasonSaveAnswer) {
          res.status(400);
          throw new Error("Bad Request");
        }

        res.status(200).json({
          success: true,
          message: "Answers saved successfully",
          result: reasonSaveAnswer,
        });
      } catch (error: any) {
        res.status(500).json({
          success: false,
          message: error?.message,
        });
      }
    }
  ),
};

export default ReasonSaveAnswerCtr;