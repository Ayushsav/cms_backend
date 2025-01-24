import {Response} from "express";
import asyncHandler from "express-async-handler";
import {CustomRequest} from "../../typeReq/customReq";
import {StatusCodes} from "http-status-codes";
import ReasonsForLeaving from "../../modals/ReasonForLeaving/ReasonForLeaving";
import ReasonAnswer from "../../modals/ReasonAnswer/ReasonAnswer";
const ReasonCtr = {
  //   create reason ctr
  createReasonctr: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        const {reason, option} = req.body;
        const data = await option.map((item: any) => {
          return item;
        });
        console.log("////", data);
        console.log(reason, option);
        const additem = await ReasonsForLeaving.create({
          reason,
        });

        if (!additem) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("Reason Not Found");
        }
        5;
        const reasonAnswers = option.map((optionText: any) => ({
          reason_id: additem.id, // Associate the reason ID to the options
          Reason_answer: optionText,
        }));

        // Bulk create the ReasonAnswer entries
        await ReasonAnswer.bulkCreate(reasonAnswers);
        //find reason with answer
        const reasonWithAnswer = await ReasonsForLeaving.findOne({
          where: {id: additem.id},
          include: {
            model: ReasonAnswer,
            attributes: ["id", "Reason_answer"],
          },
        });

        return res
          .status(StatusCodes.OK)
          .json({message: "Reason Created", success: true, result:reasonWithAnswer});
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  ),
  //fetch reason Ctr
  fetchReasonCtr: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        const fetchItems = await ReasonsForLeaving.findAll({
          include: {
            model: ReasonAnswer,
            attributes: ["id", "Reason_answer"],
          },
          attributes: ["id", "reason"], // Fetch only required attributes
        });

        if (!fetchItems) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("Reason not found");
        }
        // const formattedResult = fetchItems.map((item) => ({
        //   id: item.id,
        //   reason: item.reason,
        //   reasonAnswers:
        //     item.ReasonAnswers?.map(
        //       (answer: {Reason_answer: any}) => answer.Reason_answer
        //     ) || [],
        // }));

        return res
          .status(StatusCodes.OK)
          .json({message: "", success: true, result: fetchItems});
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  ),
  //   remove reson ctr
  removeReasonCtr: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        const removeitem = await ReasonsForLeaving.findByPk(req.params.id);
        if (!removeitem) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("Reason not found ");
        } else {
          await removeitem.destroy();
        }
        return res
          .status(StatusCodes.OK)
          .json({message: "Reason removed successfully", success: true});
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  ),
  //   edit reason ctr
  updateReasonCtr: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        const checkitems = await ReasonsForLeaving.findByPk(req.params.id);
        if (!checkitems) {
          res.status(StatusCodes.BAD_REQUEST);
          throw new Error("Reason not found ");
        }
        await checkitems.update({reason: req.body.reason});
        //find reason with answer
        const reasonWithAnswer = await ReasonsForLeaving.findOne({
          where: {id: checkitems.id},
          include: {
            model: ReasonAnswer,
            attributes: ["id", "Reason_answer"],
          },
        });
        return res.status(StatusCodes.OK).json({
          message: "updated successfully",
          success: true,
          result: reasonWithAnswer,
        });
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  ),
};
export default ReasonCtr;
