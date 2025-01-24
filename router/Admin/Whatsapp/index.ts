import {Router} from "express";
import verifyToken from "../../../middleware/auth/Verifytoken";
import WhatsAppCtr from "../../../controller/WhatsAppController";
const whatsappRouter = Router();

whatsappRouter.post("/send-message", verifyToken, WhatsAppCtr.sendMessageCtr);
whatsappRouter.post("/send-multiple-message", verifyToken, WhatsAppCtr.sendMultipleMessageCtr);

export default whatsappRouter;
