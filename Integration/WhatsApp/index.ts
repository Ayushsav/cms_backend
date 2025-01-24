import asyncHandler from "express-async-handler";
import Candidate from "../../modals/Candidate/Candidate";
import {Op, Sequelize} from "sequelize";
import sendMessage from "../../utils/SendWhatsAppMessage";
import sequelize from "sequelize";

// Modify the function to not rely on `req` and `res`
const sendExitInterviewMessage = async (): Promise<void> => {
  try {
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate());

    // Find candidates with empty reasons and no recent reminders
    const candidates = await Candidate.findAll({
      attributes: ["id", "name", "whatsappNumber", "lastReminderSent"],
      where: {
        [Op.or]: [
          { lastReminderSent: { [Op.lt]: tenDaysAgo } },
          
        ],
        [Op.and]: [
          Sequelize.literal(
            `NOT EXISTS (SELECT 1 FROM \`ReasonSaveAnswer\` WHERE \`ReasonSaveAnswer\`.\`candidateId\` = \`Candidate\`.\`id\`)`
          ),
        ],
      },
    });

    
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
  } catch (error: any) {
    console.error("WhatsApp message send error:", error);
  }
};

export default sendExitInterviewMessage;
