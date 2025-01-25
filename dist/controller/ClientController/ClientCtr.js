"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const User_1 = __importDefault(require("../../modals/User/User"));
const Client_1 = __importDefault(require("../../modals/Client/Client"));
const http_status_codes_1 = require("http-status-codes");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const ClientTags_1 = __importDefault(require("../../modals/ClientTags"));
const Tag_1 = __importDefault(require("../../modals/Tag/Tag"));
const index_1 = __importDefault(require("../../modals/UserSecurityAnswer/index"));
const SendMail_1 = __importDefault(require("../../utils/SendMail"));
const crypto_1 = __importDefault(require("crypto"));
const Token_1 = __importDefault(require("../../modals/Token/Token"));
const ClientCtr = {
    // create client
    createclientctr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { FirstName, LastName, Email, Phone, Address, PostCode, GstNumber, Status, tags, } = req.body;
            // check User existance
            // const userExists: number | unknown = await User.findByPk(req.user);
            // if (!userExists) {
            //   res.status(404);
            //   throw new Error("User Not Found Please Login !");
            // }
            const password = Phone;
            const hashpassword = yield bcryptjs_1.default.hash(password, 10);
            const clientUser = yield User_1.default.create({
                FirstName,
                LastName,
                Email,
                Phone,
                Password: hashpassword,
            });
            const response = yield Client_1.default.create({
                userId: clientUser.id,
                Address,
                PostCode,
                GstNumber,
                Status,
            });
            if (tags) {
                for (const tag of tags) {
                    yield ClientTags_1.default.create({
                        ClientId: response.id,
                        tagId: tag,
                    });
                }
            }
            if (!response) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND);
                throw new Error("Client Not Found");
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
                where: { userId: response.userId },
            });
            if (token) {
                yield token.destroy();
            }
            yield Token_1.default.create({
                userId: response.userId,
                token: hashedToken,
                createdAt: new Date(),
                expireAt: new Date(Date.now() + 30 * 60 * 1000), // Thirty minutes
            });
            const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
            const message = `
      <h2>Hello ${clientUser.FirstName}</h2>
      <p>Please use the url below to reset your password</p>
      <p> Here is your credential for login</p>
      <p>Email: ${clientUser.Email}</p>
      
      <p>This reset link is valid for only 30 minutes.</p>

      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>

      <p>Regards...</p>
      <p>Ignitive Team</p>
    `;
            //send the mail to client for your account is created successfully now change your password
            (0, SendMail_1.default)({ send_to: clientUser.Email, subject: "Account Created", message });
            const tagNAme = (tags) => __awaiter(void 0, void 0, void 0, function* () {
                const tagNames = [];
                for (const tagId of tags) {
                    const tag = yield Tag_1.default.findByPk(tagId);
                    tagNames.push(tag);
                }
                return tagNames;
            });
            const tagsName = yield tagNAme(tags);
            const _a = clientUser.dataValues, { Password, id } = _a, userData = __rest(_a, ["Password", "id"]); // Exclude password
            const flattenedResponse = Object.assign({}, response.dataValues, userData, { tags: tagsName });
            //also include tags in response
            console.log(flattenedResponse);
            return res.status(http_status_codes_1.StatusCodes.CREATED).json({
                message: "client created successfully",
                success: true,
                result: flattenedResponse,
            });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
    //   fetch client ctr
    fetchclientctr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // check User existance
            // const userExists: number | unknown = await User.findByPk(req.user);
            // if (!userExists) {
            //   res.status(404);
            //   throw new Error("User Not Found Please Login !");
            // }
            const response = yield Client_1.default.findAll({
                include: [
                    {
                        model: User_1.default,
                        as: "user",
                        attributes: [
                            "FirstName",
                            "LastName",
                            "Email",
                            "Phone",
                            "ProfileImage",
                            "Type",
                        ],
                    },
                    {
                        model: Tag_1.default, // Include Tag model instead of CandidateTags
                        as: "tags",
                    },
                ],
            });
            if (!response) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND);
                throw new Error("Client Not Found");
            }
            const results = response.map((client) => {
                var _a, _b, _c, _d, _e, _f, _g;
                return ({
                    id: client.id,
                    userId: client.userId,
                    Address: client.Address,
                    PostCode: client.PostCode,
                    GstNumber: client.GstNumber,
                    Status: client.Status,
                    createdAt: client.createdAt,
                    updatedAt: client.updatedAt,
                    FirstName: ((_a = client.user) === null || _a === void 0 ? void 0 : _a.FirstName) || null,
                    LastName: ((_b = client.user) === null || _b === void 0 ? void 0 : _b.LastName) || null,
                    Email: ((_c = client.user) === null || _c === void 0 ? void 0 : _c.Email) || null,
                    Phone: ((_d = client.user) === null || _d === void 0 ? void 0 : _d.Phone) || null,
                    ProfileImage: ((_e = client.user) === null || _e === void 0 ? void 0 : _e.ProfileImage) || null,
                    Type: ((_f = client.user) === null || _f === void 0 ? void 0 : _f.Type) || null,
                    tags: ((_g = client.tags) === null || _g === void 0 ? void 0 : _g.map((tag) => ({
                        id: tag.id,
                        Tag_Name: tag.Tag_Name,
                    }))) || [], // Ensure tags is always an array
                });
            });
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "fetch Client data successfully",
                success: true,
                result: results,
            });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
    // remove client ctr
    removeclientctr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // // check User existance
            // const userExists: number | unknown = await User.findByPk(req.user);
            // if (!userExists) {
            //   res.status(StatusCodes.UNAUTHORIZED);
            //   throw new Error("User Not Found Please Login !");
            // }
            const client = yield Client_1.default.findByPk(req.params.id);
            if (!client) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND);
                throw new Error("Client not found");
            }
            const tokens = yield Token_1.default.findAll({
                where: {
                    userId: client.userId,
                },
            });
            for (const token of tokens) {
                yield token.destroy();
            }
            const user = yield User_1.default.findByPk(client.userId);
            if (!user) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND);
                throw new Error("Associated user not found");
            }
            const tags = yield ClientTags_1.default.findAll({
                where: {
                    ClientId: req.params.id,
                },
            });
            // Delete the client and user
            yield client.destroy(); // Delete the client record
            yield user.destroy(); // Delete the associated user record
            for (const tag of tags) {
                yield tag.destroy();
            }
            return res
                .status(http_status_codes_1.StatusCodes.OK)
                .json({ message: "remove client successfully", success: true });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
    //   edit client ctr
    editclientctr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { FirstName, LastName, Email, Phone, Address, PostCode, GstNumber, Status, tags, } = req.body;
            // check User existance
            // const userExists: number | unknown = await User.findByPk(req.user);
            // if (!userExists) {
            //   res.status(StatusCodes.UNAUTHORIZED);
            //   throw new Error("User Not Found Please Login !");
            // }
            const checkClientData = yield Client_1.default.findByPk(req.params.id);
            if (!checkClientData) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND);
                throw new Error("Client Not Found");
            }
            checkClientData.update({
                Address,
                PostCode,
                GstNumber,
                Status,
            });
            const checkClient = yield User_1.default.findByPk(checkClientData.userId);
            if (!checkClient) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND);
                throw new Error("Client Not Found");
            }
            checkClient.update({
                FirstName,
                LastName,
                Email,
                Phone,
            });
            if (tags) {
                const clientTags = yield ClientTags_1.default.findAll({
                    where: {
                        ClientId: checkClientData.id,
                    },
                });
                for (const tag of clientTags) {
                    yield tag.destroy();
                }
                for (const tag of tags) {
                    yield ClientTags_1.default.create({
                        ClientId: checkClientData.id,
                        tagId: tag,
                    });
                }
            }
            const tagNAme = (tags) => __awaiter(void 0, void 0, void 0, function* () {
                const tagNames = [];
                for (const tagId of tags) {
                    const tag = yield Tag_1.default.findByPk(tagId);
                    tagNames.push(tag);
                }
                return tagNames;
            });
            const tagsName = yield tagNAme(tags);
            //merge user and client data for response exclude password field from user
            const _a = checkClient.dataValues, { Password, id } = _a, userData = __rest(_a, ["Password", "id"]); // Exclude Password
            const flattenedResponse = Object.assign({}, checkClientData.dataValues, userData, { tags: tagsName });
            return res
                .status(http_status_codes_1.StatusCodes.OK)
                .json({
                message: "Client updated successfully",
                success: true,
                result: flattenedResponse,
            });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
    hasAnswer: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            //check user id is present or not in UserSecurityAnswer table we need boolen value
            const userSecurityAnswer = yield index_1.default.findOne({
                where: {
                    userId: req.user.id,
                },
            });
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "User has answer",
                success: true,
                hasSecurityQuestion: !!userSecurityAnswer,
            });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
};
exports.default = ClientCtr;
