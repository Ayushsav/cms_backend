import asyncHandler from "express-async-handler";
import {CustomRequest} from "../../typeReq/customReq";
import {Response} from "express";
import SecurityQuestion from "../../modals/SecurityQuestions";
import {StatusCodes} from "http-status-codes";
const securityctr = {
  //  add clien security data
  createsecurity: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        let {questionText} = req.body;
        const addsecurity = await SecurityQuestion.create({
          questionText,
        });

        if (!addsecurity) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("Bad Request");
        }
        return res.status(StatusCodes.CREATED).json({
          message: "added successfully",
          success: true,
          result: addsecurity,
        });
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  ),

  //   fetch   security data
  fetchsecurity: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        const fetchsecurity = await SecurityQuestion.findAll();
        if (!fetchsecurity) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("Bad Request");
        }
        return res.status(StatusCodes.CREATED).json({
          message: "fetch data successfully",
          success: true,
          result: fetchsecurity,
        });
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  ),

  //   remove  security data
  removesecurity: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        const removeSecurity = await SecurityQuestion.findByPk(req.params.id);
        if (!removeSecurity) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("Bad Request");
        } else {
          await removeSecurity.destroy();
        }
        return res.status(StatusCodes.OK).json({
          message: "remove security successfully",
          result: removeSecurity,
          success: true,
        });
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  ),

  //   edity  security data

  updatesecurity: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        let {questionText} = req.body;
      
        const updateSecurity = await SecurityQuestion.findByPk(req.params.id);
        if (!updateSecurity) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("Bad Request");
        } else {
          await updateSecurity.update({questionText});
        }
        return res.status(StatusCodes.OK).json({
          message: "remove security successfully",
          result: updateSecurity,
          success: true,
        });
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  ),
};

export default securityctr;
