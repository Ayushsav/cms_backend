"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserCtr_1 = __importDefault(require("../../controller/UserController/UserCtr"));
const Verifytoken_1 = __importDefault(require("../../middleware/auth/Verifytoken"));
const userRouter = express_1.default.Router();
userRouter.post("/register", UserCtr_1.default.registerCtr);
userRouter.post("/login", UserCtr_1.default.loginCtr);
userRouter.get("/profile", UserCtr_1.default.profileCtr);
userRouter.post("/forget-password", UserCtr_1.default.forgetpasswordCtr);
userRouter.post("/change-password", Verifytoken_1.default, UserCtr_1.default.changePasswordCtr);
userRouter.post("/reset-password/:resetToken", UserCtr_1.default.resetpasswordCtr);
exports.default = userRouter;
