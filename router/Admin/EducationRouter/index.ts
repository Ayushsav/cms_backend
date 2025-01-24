import express from "express";
import EducationCtr from "../../../controller/EducationController/EducationCtr";

const educationRouter = express.Router();

educationRouter.post("/create-education", EducationCtr.createEducationctr);
educationRouter.get("/get-education", EducationCtr.fetchEducationctr);
educationRouter.put("/update-education/:id", EducationCtr.updateEducationctr);
educationRouter.delete("/delete-education/:id", EducationCtr.deleteEducationctr);
export default educationRouter;
