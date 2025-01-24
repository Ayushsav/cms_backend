import asyncHandler from "express-async-handler";
import {CustomRequest} from "../../typeReq/customReq";
import {Response} from "express";
import User from "../../modals/User/User";
import {StatusCodes} from "http-status-codes";
import ClientSecurity from "../../modals/ClientSecurity/ClientSecurity";
import bcrypt from "bcryptjs";
import UserSecurityAnswer from "../../modals/UserSecurityAnswer/index";
import SecurityQuestion from "../../modals/SecurityQuestions/index";
import Token from "../../modals/Token/Token";
import crypto from "crypto";
import Client from "../../modals/Client/Client";

const clientsecurityctr = {
  //  add clien security data
  setSecurityQueAnsCtr: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        // Ensure the user exists
        const checkUser = await User.findByPk(req.user.id);
        if (!checkUser) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("User Not Found");
        }

        const {questionsAndAnswers} = req.body;

        if (
          !Array.isArray(questionsAndAnswers) ||
          questionsAndAnswers.length === 0
        ) {
          res.status(StatusCodes.BAD_REQUEST);
          throw new Error(
            "Invalid input. Expected an array of question and answer pairs."
          );
        }

        for (const {questionId, answer} of questionsAndAnswers) {
          // Validate that the question exists in the SecurityQuestion table
          const securityQuestion = await SecurityQuestion.findByPk(questionId);
          if (!securityQuestion) {
            throw new Error(
              `Security question with ID ${questionId} not found`
            );
          }

          // Hash the answer using bcrypt
          const hashedAnswer = await bcrypt.hash(answer, 10);

          // Check if the user already has an answer for this question
          const existingAnswer = await UserSecurityAnswer.findOne({
            where: {
              userId: req.user.id,
              questionId,
            },
          });

          if (existingAnswer) {
            // If an answer exists, update it
            existingAnswer.answerHash = hashedAnswer;
            await existingAnswer.save();
          } else {
            // If no answer exists, create a new record
            await UserSecurityAnswer.create({
              userId: req.user.id,
              questionId,
              answerHash: hashedAnswer,
            });
          }
        }

        // Send success response
        res.status(StatusCodes.OK).json({
          message: "Security questions and answers set successfully",
          success: true,
        });
      } catch (error: any) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: error?.message || "Something went wrong",
        });
      }
    }
  ),

  checkSecurityQueAnsCtr: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        // Ensure the user exists
        const {Email} = req.body;
        console.log(Email, "email called");
        const checkUser = await User.findOne({
          where: {Email},
        });
        if (!checkUser) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("User Not Found");
        }
        //we need to send the questions of the user in response
        const Allquestions = await UserSecurityAnswer.findAll({
          where: {userId: checkUser.id},
          include: {
            model: SecurityQuestion,
            as: "securityQuestion",
          },
          //exclude everything except id
          attributes: ["id"],
        });
        if (!Allquestions || Allquestions.length === 0) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("No security questions found for this user");
        }
        return res.status(StatusCodes.OK).json({
          message: "Security questions fetched successfully",
          success: true,
          result: Allquestions,
          email: Email,
        });
      } catch (error: any) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: error?.message || "Something went wrong",
        });
      }
    }
  ),
  verifySecurityQueAnsCtr: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        const {Email, answers} = req.body; // `answers` contains questionId and answer pairs
        console.log(Email, "email called");

        // Check if the user exists
        const checkUser = await User.findOne({
          where: {Email},
        });
        if (!checkUser) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("User Not Found");
        }

        const userId = checkUser.id;

        // Iterate over answers and validate
        const validationResults = await Promise.all(
          answers.map(
            async (answerObj: {questionId: number; answer: string}) => {
              const {questionId, answer} = answerObj;

              // Fetch the security answer record for the user and question
              const securityAnswerRecord = await UserSecurityAnswer.findOne({
                where: {userId, questionId},
                include: [
                  {
                    model: SecurityQuestion,
                    as: "securityQuestion",
                  },
                ],
              });

              if (!securityAnswerRecord) {
                return {
                  questionId,
                  success: false,
                  message: "Security question not found for this user.",
                };
              }

              // Compare provided answer hash with the stored hash
              const isAnswerValid = await bcrypt.compare(
                answer,
                securityAnswerRecord.answerHash
              );

              return {
                questionId,
                success: isAnswerValid,
                message: isAnswerValid
                  ? "Answer validated successfully."
                  : "Answer is incorrect.",
              };
            }
          )
        );

        // Check if all validations passed
        const allValid = validationResults.every((result) => result.success);

        if (allValid) {
          let resetToken =
            crypto.randomBytes(32).toString("hex") + checkUser.id;

          // Hash token before saving to DB
          const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");
          // Delete token if it exists in DB

          let token = await Token.findOne({
            where: {userId: checkUser.id},
          });

          if (token) {
            await token.destroy();
          }

          await Token.create({
            userId: checkUser.id,
            token: hashedToken,
            createdAt: new Date(),
            expireAt: new Date(Date.now() + 30 * 60 * 1000), // Thirty minutes
          });

          res.status(StatusCodes.OK).json({
            message: "All security answers verified successfully.",
            success: true,
            result: resetToken,
          });
        } else {
          res.status(StatusCodes.BAD_REQUEST).json({
            message: "One or more security answers are incorrect.",
            success: false,
          });
        }
      } catch (error: any) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: error?.message || "Something went wrong",
        });
      }
    }
  ),
  //   fetch  client security data
  fetchclientsecurity: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        const fetchsecurity = await ClientSecurity.findAll();

        if (!fetchsecurity || fetchsecurity.length === 0) {
          return res.status(StatusCodes.NOT_FOUND).json({
            message: "No security data found.",
            success: false,
          });
        }

        return res.status(StatusCodes.OK).json({
          message: "Security data fetched successfully.",
          success: true,
          result: fetchsecurity,
        });
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  ),

  //   remove client security data
  removeclientsecurity: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        // remove security
        const removeSecurity = await ClientSecurity.findByPk(req.params.id);

        if (!removeSecurity) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("Security entry not found.");
        }

        await removeSecurity.destroy();

        return res.status(StatusCodes.OK).json({
          message: "Security entry removed successfully.",
          success: true,
        });
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  ),

  //   edity client security data

  updateclientsecurity: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      const {ClientId, QuestionId, Answer} = req.body;
      // Validate required fields
      if (!ClientId || !QuestionId || !Answer) {
        res.status(StatusCodes.BAD_REQUEST);
        throw new Error("ClientId, QuestionId, and Answer are required.");
      }

      try {
        const updateSecurity = await ClientSecurity.findByPk(req.params.id);

        if (!updateSecurity) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("Security entry not found.");
        }

        await updateSecurity.update({ClientId, QuestionId, Answer});

        return res.status(StatusCodes.OK).json({
          message: "Client Security entry updated successfully.",
          success: true,
          result: updateSecurity,
        });
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  ),

  // total client
  totalclientCount: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        const checkUser = await User.findByPk(req.user.id);
        if (!checkUser) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("User Not Found");
        }

        const fetchcountclient = await Client.findAndCountAll();
        if (!fetchcountclient) {
          res.status(400);
          throw new Error("bad Request");
        }
        return res.status(200).json({
          message: "fetch count successfully",
          result: fetchcountclient,
          success: true,
        });
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  ),
};

export default clientsecurityctr;
