import {Response, Request} from "express";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";

import {StatusCodes} from "http-status-codes";
import Candidate from "../../modals/Candidate/Candidate";
import sendMessage from "../../utils/SendWhatsAppMessage";
import { CustomRequest } from "../../typeReq/customReq";
dotenv.config();

const WhatsAppCtr = {
  
  //   SignIn Ctr
  sendMessageCtr: asyncHandler(async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const { id } = req.body;
        const candidate = await Candidate.findOne({
            where: {
                id
            },
            attributes: ["id", "name", "whatsappNumber", "lastReminderSent"],
        });
        if (!candidate) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Candidate not found"
            });
        }
       
            // Call the WhatsApp API to send a message
            console.log("Sending message to candidate:", candidate.whatsappNumber);
            const user = {
              name: candidate.name,
              url: `http://localhost:3000/reason-leaving-job/${candidate.id}`,
              phone: candidate.whatsappNumber,
            };
            await sendMessage(user);
      
            // Update the `lastReminderSent` field
            candidate.lastReminderSent = new Date();
            await candidate.save();
        return res.status(StatusCodes.OK).json({
            message: "Message sent successfully",
            success: true,
        });
          
    } catch (error: any) {
      throw new Error(error?.message);
    }
  }),
  sendMultipleMessageCtr: asyncHandler(async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const { ids } = req.body;
        const candidates = await Candidate.findAll({
            where: {
                id: ids
            },
            attributes: ["id", "name", "whatsappNumber", "lastReminderSent"],
        });
        if (!candidates) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Candidate not found"
            });
        }
        for (const candidate of candidates) {
            // Call the WhatsApp API to send a message
            console.log("Sending message to candidate:", candidate.whatsappNumber);
            const user = {
              name: candidate.name,
              url: `http://localhost:3000/reason-leaving-job/${candidate.id}`,
              phone: candidate.whatsappNumber,
            };
            await sendMessage(user);
      
            // Update the `lastReminderSent` field
            candidate.lastReminderSent = new Date();
            await candidate.save();
        }
        return res.status(StatusCodes.OK).json({
            message: "Message sent successfully",
            success: true,
        });
          
    } catch (error: any) {
      throw new Error(error?.message);
    }
  }),
 
  
};

export default WhatsAppCtr;
