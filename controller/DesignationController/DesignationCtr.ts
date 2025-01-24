import asyncHandler from "express-async-handler";
import {Request, Response} from "express";
import User from "../../modals/User/User";
import {CustomRequest} from "../../typeReq/customReq";
import Designation from "../../modals/Designation/Designation";
import {StatusCodes} from "http-status-codes";

const DesignationCtr = {
  // create designation ctr
  createdesignationctr: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        const userExists:any = await User.findOne(
          {where: {id: req.user.id},
        attributes: ["id", "Type"],
      });
        if (userExists.Type !== "superadmin") {
          res.status(StatusCodes.BAD_REQUEST);
          throw new Error("You are not authorized to create designation");
        }
        
        const {title} = req.body;
        // check User existance
        // const userExists: number | unknown = await User.findByPk(req.user);
        // if (!userExists) {
        //   res.status(404);
        //   throw new Error("User Not Found Please Login !");
        // }
        //check designation existance
        const checkdesignation = await Designation.findOne({where: {title}});
        if (checkdesignation) {
          res.status(StatusCodes.BAD_REQUEST);
          throw new Error("Designation Already Exist");
        }
        const itemresp = await Designation.create({
          title,
        });
        if (!itemresp) {
          res.status(400);
          throw new Error("Bad Request");
        }

        return res
          .status(StatusCodes.OK)
          .json({success: true, message: "designation created Successfully",result:itemresp});
      } catch (error: any) {
        throw new Error(error);
      }
    }
  ),
  //   fetch designation ctr
  fetchdesignationCtr: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        // const userExists: string | any = await User.findByPk(req.user);
        // if (!userExists) {
        //   res.status(404);
        //   throw new Error("User Not Found Please Login !");
        // }
        const fetchitems = await Designation.findAll();
        if (!fetchitems) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("");
        }
        return res.status(StatusCodes.OK).json({
          message: "Fetch designation Successfully",
          success: true,
          result: fetchitems,
        });
      } catch (error: any) {
        throw new Error(error);
      }
    }
  ),

  //   remove designation ctr
  reomvedesignationCtr: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        // const userExists: string | any = await User.findByPk(req.user);
        // if (!userExists) {
        //   res.status(404);
        //   throw new Error("User Not Found Please Login !");
        // }
        const userExists:any = await User.findOne(
          {where: {id: req.user.id},
        attributes: ["id", "Type"],
      });
        if (userExists.Type !== "superadmin") {
          res.status(StatusCodes.BAD_REQUEST);
          throw new Error("You are not authorized to create designation");
        }
        const removeitem = await Designation.findByPk(req.params.id);
        if (!removeitem) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("Item not Found");
        } else {
          try {
            await removeitem.destroy();
          } catch (error: any) {
            throw new Error(error);
          }
        }
        return res.status(StatusCodes.OK).json({
          message: "designation items remove successfully",
          success: true,
        });
      } catch (error: any) {
        throw new Error(error);
      }
    }
  ),
  //   edit desingation ctr
  editdesignationCtr: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<void | any> => {
      try {
        // const userExists: string | any = await User.findByPk(req.user);
        // if (!userExists) {
        //   res.status(404);
        //   throw new Error("User Not Found Please Login !");
        // }
        const userExists:any = await User.findOne(
          {where: {id: req.user.id},
        attributes: ["id", "Type"],
      });
        if (userExists.Type !== "superadmin") {
          res.status(StatusCodes.BAD_REQUEST);
          throw new Error("You are not authorized to create designation");
        }
        const checkDesigation = await Designation.findByPk(req.params.id);
        if (!checkDesigation) {
          res.status(StatusCodes.BAD_REQUEST);
          throw new Error("Bad Request");
        }
        //check if designation exist
        
        const {title} = req.body;
        const checkdesignation = await Designation.findOne({where: {title}});
        if (checkdesignation) {
          res.status(StatusCodes.BAD_REQUEST);
          throw new Error("Designation Already Exist");
        }
        await checkDesigation.update({title});
        return res
          .status(StatusCodes.OK)
          .json({message: "Update designation succesfully", success: true,result:checkDesigation});
      } catch (error: any) {
        throw new Error(error);
      }
    }
  ),
};

export default DesignationCtr;
