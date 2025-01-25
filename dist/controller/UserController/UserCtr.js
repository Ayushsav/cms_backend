"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const User_1 = __importDefault(require("../../modals/User/User"));
const Token_1 = __importDefault(require("../../modals/Token/Token"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const generateToken_1 = __importStar(require("../../middleware/auth/generateToken"));
const SendMail_1 = __importDefault(require("../../utils/SendMail"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sequelize_1 = require("sequelize");
const http_status_codes_1 = require("http-status-codes");
const Client_1 = __importDefault(require("../../modals/Client/Client"));
dotenv_1.default.config();
const UserCtr = {
    // Register ctr
    registerCtr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let { FirstName, LastName, Email, Phone, Password } = req.body;
            const hashpassword = yield bcryptjs_1.default.hash(Password, 10);
            Password = hashpassword;
            const response = yield User_1.default.create({
                FirstName,
                LastName,
                Email,
                Password,
                Phone,
            });
            if (!response) {
                res.status(400);
                throw new Error("User Not Found");
            }
            return res.status(201).json({
                message: "registration successfully completed",
                success: true,
            });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
    //   SignIn Ctr
    loginCtr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield User_1.default.findOne({
                where: { Email: req.body.Email },
            });
            // console.log(response, "response backend");
            if (!response) {
                res.status(400);
                throw new Error("User Not Found Please Sign in");
            }
            if (response.Type === "client") {
                const client = yield Client_1.default.findOne({
                    where: { userId: response.id },
                });
                if (!client) {
                    res.status(400);
                    throw new Error("Client Not Found Please Sign in");
                }
                //check client status
                if (client.Status === "InActive") {
                    res.status(400);
                    throw new Error("Your Account is InActive Please Contact Admin");
                }
            }
            // compare password
            const checkpassword = yield bcryptjs_1.default.compare(req.body.Password, response.Password);
            // check password
            if (!checkpassword) {
                res.status(400);
                throw new Error("User and Password Not Found");
            }
            // generate token
            const token = yield (0, generateToken_1.default)(response.id);
            // generate refresh token
            const refreshTokenValue = yield (0, generateToken_1.refreshToken)(response.id);
            console.log("refreshTokenValue", refreshTokenValue);
            return res.status(200).json({
                message: "Login Successfully",
                result: token,
                refreshToken: refreshTokenValue,
                success: true,
            });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
    //refresh token controller
    refreshTokenCtr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { refreshTokens } = req.body;
            console.log("refreshToken", generateToken_1.refreshToken);
            // const token = req.cookies;
            // console.log("token", token);
            // if (!token?.jwt) {
            //   return res.status(400).json({message: "Unauthorized"});
            // }
            // const refreshTokenValues = token.jwt;
            // console.log("refreshTokenValues", refreshTokenValues);
            // console.log("refreshTokenValues", refreshTokenValues);
            if (!refreshTokens) {
                return res.status(400).json({ message: "Unauthorized" });
            }
            const decoded = jsonwebtoken_1.default.verify(refreshTokens, process.env.JWT_SECRET);
            console.log("decoded", decoded);
            const user = yield User_1.default.findByPk(decoded.id);
            console.log("user", user);
            if (!user) {
                res.status(404).json({ message: "User not found, Please login" });
                return;
            }
            const newToken = yield (0, generateToken_1.default)(user.id);
            const refreshTokenValue = yield (0, generateToken_1.refreshToken)(user.id);
            res.status(200).json({
                success: true,
                message: "Token Refreshed",
                result: newToken,
                refreshToken: refreshTokenValue,
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    })),
    // logout Ctr
    logoutCtr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            res.cookie("jwt", "", {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                expires: new Date(0),
            });
            res.status(200).json({
                success: true,
                message: "Logged Out",
            });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
    // Profile Ctr
    profileCtr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // const response = await User.findByPk(req.user.id);
            //exclude password
            const response = yield User_1.default.findOne({
                where: { id: req.user.id },
                attributes: { exclude: ["Password"] },
            });
            if (!response) {
                res.status(400);
                throw new Error("User Not Found Please Sign in");
            }
            return res.status(200).json({
                message: "successfully fetch data",
                status: "success",
                result: response,
            });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
    getUserCtr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield User_1.default.findOne({
                where: { id: req.user.id },
                attributes: { exclude: ["Password"] },
            });
            if (!response) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST);
                throw new Error("Bad request");
            }
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "User fetched", result: response, success: true,
            });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
    // forget Ctr
    forgetpasswordCtr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log(req.body);
            const response = yield User_1.default.findOne({
                where: { Email: req.body.Email },
            });
            if (!response) {
                res.status(400);
                throw new Error("User Not Found Please enter correct Email Address");
            }
            let resetToken = crypto_1.default.randomBytes(32).toString("hex") + response.id;
            console.log(resetToken);
            // Hash token before saving to DB
            const hashedToken = crypto_1.default
                .createHash("sha256")
                .update(resetToken)
                .digest("hex");
            // Delete token if it exists in DB
            console.log("forget hashed", hashedToken);
            let token = yield Token_1.default.findOne({
                where: { userId: response.id },
            });
            if (token) {
                yield token.destroy();
            }
            yield Token_1.default.create({
                userId: response.id,
                token: hashedToken,
                createdAt: new Date(),
                expireAt: new Date(Date.now() + 30 * 60 * 1000), // Thirty minutes
            });
            const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
            const message = `
      <h2>Hello ${response.FirstName}</h2>
      <p>Please use the url below to reset your password</p>
      <p>This reset link is valid for only 30minutes.</p>

      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>

      <p>Regards...</p>
      <p>Ignitive Team</p>
    `;
            const subject = "Password Reset Request";
            const send_to = response.Email;
            console.log("send_to", send_to, "message", message, "subject", subject);
            yield (0, SendMail_1.default)({ subject, message, send_to });
            return res
                .status(200)
                .json({ message: "Please check your Email ", success: true });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
    // Reset token
    resetpasswordCtr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { password } = req.body;
            const { resetToken } = req.params;
            // Hash token, then compare to Token in DB
            const hashedToken = crypto_1.default
                .createHash("sha256")
                .update(resetToken)
                .digest("hex");
            // fIND tOKEN in DB
            console.log(hashedToken, "hashedToken");
            const userToken = yield Token_1.default.findOne({
                where: {
                    token: hashedToken,
                    expireAt: {
                        [sequelize_1.Op.gt]: new Date(), // checks if expireAt is greater than current date
                    },
                },
            });
            //token not matched i think we need to compare that
            if (!userToken) {
                res.status(404);
                throw new Error("Invalid or Expired Token");
            }
            // Find user
            const user = yield User_1.default.findOne({ where: { id: userToken.userId } });
            const hashpassword = yield bcryptjs_1.default.hash(password, 10);
            if (!user) {
                res.status(404);
                throw new Error("User not found");
            }
            user.Password = hashpassword;
            yield user.save();
            res.status(200).json({
                message: "Password Reset Successful, Please Login Again",
            });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
    // Change Password Ctr
    changePasswordCtr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { oldPassword, Password } = req.body;
            const user = yield User_1.default.findOne({ where: { id: req.user.id } });
            if (!user) {
                res.status(401);
                throw new Error("User not found, please signup");
            }
            if (!oldPassword || !Password) {
                res.status(400);
                throw new Error("Please add old and new password");
            }
            // check if old password matches password in DB
            const passwordIsCorrect = yield bcryptjs_1.default.compare(oldPassword, user.Password);
            if (!passwordIsCorrect) {
                res.status(400);
                throw new Error("Old password is incorrect");
            }
            // Save new password
            if (user && passwordIsCorrect) {
                const hashpassword = yield bcryptjs_1.default.hash(Password, 10);
                user.Password = hashpassword;
                yield user.save();
                res.status(200).json({
                    success: true,
                    message: "Password changed successfully",
                });
            }
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
    editprofileCtr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { FirstName, LastName, Email, Phone } = req.body;
            const user = yield User_1.default.findOne({ where: { id: req.user.id } });
            if (!user) {
                res.status(401);
                throw new Error("User not found");
            }
            if (!FirstName || !LastName || !Email || !Phone) {
                res.status(400);
                throw new Error("Please provide all required fields");
            }
            user.FirstName = FirstName;
            user.LastName = LastName;
            user.Email = Email;
            user.Phone = Phone;
            // Handle uploaded image
            if (req.file) {
                console.log("images", req.file);
                user.ProfileImage = `/uploads/profileImages/${req.file.filename}`;
            }
            yield user.save();
            //exclude password
            res.status(200).json({
                message: "Profile updated successfully",
                success: true,
                result: user,
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    })),
    gettoken: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const accessToken = yield jsonwebtoken_1.default.sign({
                UserInfo: {
                    username: "1",
                },
            }, "secrete", { expiresIn: "15m" });
            console.log(accessToken);
            const refreshToken = yield jsonwebtoken_1.default.sign({ username: "1" }, "secrete", { expiresIn: "7d" });
            console.log(refreshToken);
            // Create secure cookie with refresh token
            res.cookie("jwt", refreshToken, {
                path: "/",
                httpOnly: true,
                expires: new Date(Date.now() + 1000 * 86400), // 1 day
                sameSite: "none",
                secure: true,
            });
            res.json({ accessToken });
        }
        catch (error) { }
    })),
};
exports.default = UserCtr;
