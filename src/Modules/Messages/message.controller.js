import { Router } from "express";
import * as MS from "./Services/message.service.js";
const messageRouter = Router();



messageRouter.post('/sendMessage/:receiverId', MS.sendMessageService);
messageRouter.get('/listmessages', MS.getMessageService);

export default messageRouter;