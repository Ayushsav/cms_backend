import asyncHandler from "express-async-handler";
import {CustomRequest} from "../../typeReq/customReq";
import {Response} from "express";
import Education from "../../modals/Eduction/Education";
import {StatusCodes} from "http-status-codes";

const EducationCtr = {
  // create Education ctr
  createEducationctr: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        const {ugCourse, pgCourse, postPgCourse, candidateId=5} = req.body;
        const response = await Education.create({
          ugCourse,
          pgCourse,
          postPgCourse,
          candidateId,
        });
        if (!response) {
          res.status;
          throw new Error("education Not Found");
        }
        return res.status(StatusCodes.CREATED).json({
          message: "education created successfully",
          success: true,
          result: response,
        });
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  ),
  //   fetch education ctr

  fetchEducationctr: asyncHandler(async (req: CustomRequest, res: Response): Promise<any> => {
    try {
      const response = await Education.findAll();
      if (!response) {
        throw new Error("education not found");
      }
      res.status(StatusCodes.OK).json({
        message: "education fetched successfully",
        success: true,
        result: response,
      });
    } catch (error: any) {
      throw new Error(error?.message);
    }
  }),
  //   update education ctr
  updateEducationctr: asyncHandler(async (req: CustomRequest, res: Response): Promise<any> => {
    try {
      const {ugCourse, pgCourse, postPgCourse, candidateId} = req.body;
      const response = await Education.update({
        ugCourse,
        pgCourse,
        postPgCourse,
        candidateId,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    if (!response) {
      throw new Error("education not found");
    }
    res.status(StatusCodes.OK).json({
      message: "education updated successfully",
      success: true,
      
    });
    } catch (error: any) {
      throw new Error(error?.message);
    }
  }),
  //   delete education ctr
  deleteEducationctr: asyncHandler(async (req: CustomRequest, res: Response): Promise<any> => {
    try {
      const response = await Education.destroy({
        where: {
          id: req.params.id,
        },
      });
      if (!response) {
        throw new Error("education not found");
      }
      res.status(StatusCodes.OK).json({
        message: "education deleted successfully",
        success: true,
      });
    } catch (error: any) {
      throw new Error(error?.message);
    }
  }),
};

export default EducationCtr;
