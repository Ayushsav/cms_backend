import express from "express";
import UserCtr from "../../controller/UserController/UserCtr";
import uploadImage from "../../middleware/UploadImage";
import verifyToken from "../../middleware/auth/Verifytoken";
const userRouter = express.Router();

userRouter.post("/register", UserCtr.registerCtr);
userRouter.post("/login", UserCtr.loginCtr);
userRouter.post("/refresh-token", UserCtr.refreshTokenCtr);
userRouter.post("/logout", UserCtr.logoutCtr);
userRouter.get("/profile", verifyToken, UserCtr.profileCtr);
userRouter.post("/forget-password", UserCtr.forgetpasswordCtr);
userRouter.post("/change-password", verifyToken, UserCtr.changePasswordCtr);
userRouter.post("/reset-password/:resetToken", UserCtr.resetpasswordCtr);
userRouter.put(
  "/update-profile",
  verifyToken,
  uploadImage.single("ProfileImage"),
  UserCtr.editprofileCtr
);
userRouter.get("/get-user", verifyToken, UserCtr.getUserCtr);
userRouter.get("/get-token",UserCtr.gettoken);


export default userRouter;
