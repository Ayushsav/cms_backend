import {Router} from "express";
import TagCtr from "../../../controller/TagsController/TagCtr";
import upload from "../../../middleware/upload";
import verifyToken from "../../../middleware/auth/Verifytoken";
const tagRouter = Router();

// tag Router
tagRouter.post("/create-tag",verifyToken, TagCtr.createtagCtr);
tagRouter.get("/fetch-tag",verifyToken, TagCtr.fetchtagsCtr);
tagRouter.delete("/remove-tag/:id",verifyToken, TagCtr.removetagsCtr);
tagRouter.put("/update-tag/:id",verifyToken, TagCtr.updatetagctr);
tagRouter.post("/import-tags",verifyToken,upload.single("file"), TagCtr.importTagsCtr);
tagRouter.get("/download-tag-template", TagCtr.returntagsCsvFile);

export default tagRouter;
