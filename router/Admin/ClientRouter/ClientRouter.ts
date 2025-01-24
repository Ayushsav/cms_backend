import express from "express";
import ClientCtr from "../../../controller/ClientController/ClientCtr";
import { verify } from "crypto";
import verifyToken from "../../../middleware/auth/Verifytoken";
let ClientRouter = express.Router();

ClientRouter.post("/create-client",verifyToken, ClientCtr.createclientctr);
ClientRouter.get("/fetch-client", ClientCtr.fetchclientctr);
ClientRouter.delete("/remove-client/:id", ClientCtr.removeclientctr);
ClientRouter.put("/edit-client/:id", ClientCtr.editclientctr);
ClientRouter.get("/fetch-hasanswer",verifyToken, ClientCtr.hasAnswer);

export default ClientRouter;
