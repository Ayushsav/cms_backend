import asyncHandler from "express-async-handler";
import { CustomRequest } from "../../typeReq/customReq";
import User from "../../modals/User/User";
import { Response } from "express";
import Region from "../../modals/Region/Region";
import { StatusCodes } from "http-status-codes";

const RegionCtr = {
  createRegionctr: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        const { Name } = req.body;
        // check User existance
        // const userExists: number | unknown = await User.findByPk(req.user);
        // if (!userExists) {
        //   res.status(StatusCodes.UNAUTHORIZED);
        //   throw new Error("User Not Found Please Login !");
        // }

        const additmes = await Region.create({ Name });

        if (!additmes) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("region Not Found");
        }

        return res.status(StatusCodes.CREATED).json({
          message: "region created successfully",
          result: additmes,
          success: true,
        });
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  ),

  //   fetch region ctr

  fetchregionctr: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        // check User existance
        // const userExists: number | unknown = await User.findByPk(req.user);
        // if (!userExists) {
        //   res.status(StatusCodes.UNAUTHORIZED);
        //   throw new Error("User Not Found Please Login !");
        // }

        let fetchitems = await Region.findAll();
        if (!fetchitems) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("region Not Found");
        }
        return res.status(StatusCodes.OK).json({
          message: "region fetch succesfully",
          success: true,
          result: fetchitems,
        });
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  ),

  //   remove items ctr

  removeregionctr: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        // check use existance
        // const userExists: number | unknown = await User.findByPk(req.user);
        // if (!userExists) {
        //   res.status(StatusCodes.UNAUTHORIZED);
        //   throw new Error("User Not Found Please Login !");
        // }

        const removeitems = await Region.findByPk(req.params.id);
        if (!removeitems) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("");
        } else {
          await removeitems.destroy();
        }
        return res
          .status(StatusCodes.OK)
          .json({ message: "remove item successfully", success: true });
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  ),

  //   update itmes ctr

  editregionctr: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        // check use existance
        // const userExists: number | unknown = await User.findByPk(req.user);
        // if (!userExists) {
        //   res.status(StatusCodes.UNAUTHORIZED);
        //   throw new Error("User Not Found Please Login !");
        // }

        let checkRegion = await Region.findByPk(req.params.id);
        if (!checkRegion) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("");
        } else {
          await checkRegion.update({ Name: req.body.Name });
        }
        return res
          .status(StatusCodes.OK)
          .json({ message: "updated region successfully", success: true, result: checkRegion });
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  ),
};

export default RegionCtr;
