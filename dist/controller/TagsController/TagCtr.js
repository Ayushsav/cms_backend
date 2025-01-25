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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const User_1 = __importDefault(require("../../modals/User/User"));
const http_status_codes_1 = require("http-status-codes");
const Tag_1 = __importDefault(require("../../modals/Tag/Tag"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sequelize_1 = require("sequelize");
const fast_csv_1 = require("fast-csv");
const csv_parser_1 = __importDefault(require("csv-parser"));
const ClientTags_1 = __importDefault(require("../../modals/ClientTags"));
const Client_1 = __importDefault(require("../../modals/Client/Client"));
const TagCtr = {
    // create tags
    createtagCtr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield User_1.default.findOne({
                where: { id: req.user.id },
                attributes: ["id", "Type"],
            });
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }
            const { Tag_Name } = req.body;
            // check User existance
            // const userExists: number | unknown = await User.findByPk(req.user);
            // if (!userExists) {
            //   res.status(404);
            //   throw new Error("User Not Found Please Login !");
            // }
            if (!Tag_Name || typeof Tag_Name !== "string") {
                return res
                    .status(400)
                    .json({ error: "Tag_Name is required and must be a string." });
            }
            //check if tag already exist
            const checktags = yield Tag_1.default.findOne({
                where: {
                    [sequelize_1.Op.or]: [{ Tag_Name: Tag_Name }],
                },
            });
            if (checktags) {
                res.status(http_status_codes_1.StatusCodes.CONFLICT);
                throw new Error("Tag already exist");
            }
            const additmes = yield Tag_1.default.create({
                Tag_Name,
                Created_By: req.user.id,
            });
            if (!additmes) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND);
                throw new Error("tag not found");
            }
            if (additmes && user.Type === "client") {
                //find client id
                const client = yield Client_1.default.findOne({
                    where: { userId: req.user.id },
                });
                if (!client) {
                    res.status(http_status_codes_1.StatusCodes.NOT_FOUND);
                    throw new Error("Client not found");
                }
                yield ClientTags_1.default.create({
                    ClientId: client.id,
                    tagId: additmes.id,
                });
            }
            return res.status(http_status_codes_1.StatusCodes.CREATED).json({
                message: "Tag created successfully",
                success: true,
                result: additmes,
            });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
    //   fetch tags
    fetchtagsCtr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userExists = yield User_1.default.findOne({
                where: { id: req.user.id },
                attributes: ["id", "Type"],
            });
            if ((userExists === null || userExists === void 0 ? void 0 : userExists.Type) === "client") {
                const client = yield Client_1.default.findOne({
                    where: { userId: req.user.id },
                });
                const clientTags = yield ClientTags_1.default.findAll({
                    where: { ClientId: client === null || client === void 0 ? void 0 : client.id },
                });
                const tagIds = clientTags.map((tag) => tag.tagId);
                const fetchitmes = yield Tag_1.default.findAll({
                    where: {
                        [sequelize_1.Op.or]: [
                            { id: tagIds },
                            { Created_By: req.user.id }
                        ]
                    },
                });
                if (!fetchitmes) {
                    res.status(http_status_codes_1.StatusCodes.NOT_FOUND);
                    throw new Error("");
                }
                return res.status(http_status_codes_1.StatusCodes.OK).json({
                    message: "tags fetch successfully",
                    success: true,
                    result: fetchitmes,
                });
            }
            else {
                const fetchitmes = yield Tag_1.default.findAll();
                if (!fetchitmes) {
                    res.status(http_status_codes_1.StatusCodes.NOT_FOUND);
                    throw new Error("");
                }
                return res.status(http_status_codes_1.StatusCodes.OK).json({
                    message: "tags fetch successfully",
                    success: true,
                    result: fetchitmes,
                });
            }
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
    //   remove tags
    removetagsCtr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // check User existance
            // const userExists: number | unknown = await User.findByPk(req.user);
            // if (!userExists) {
            //   res.status(404);
            //   throw new Error("User Not Found Please Login !");
            // }
            const checktags = yield Tag_1.default.findByPk(req.params.id);
            if (!checktags) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND);
                throw new Error("");
            }
            else {
                yield checktags.destroy();
            }
            return res
                .status(http_status_codes_1.StatusCodes.OK)
                .json({ message: "remove items successfully", success: true });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
    //    edit tags ctr
    updatetagctr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const checktags = yield Tag_1.default.findByPk(req.params.id);
            //check Tag Name already exist
            if (!checktags) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND);
                throw new Error("Tag not found");
            }
            else {
                if (req.body.Tag_Name) {
                    //check if tag already exist
                    const checktagss = yield Tag_1.default.findOne({
                        where: {
                            [sequelize_1.Op.or]: [{ Tag_Name: req.body.Tag_Name }],
                        },
                    });
                    if (checktagss) {
                        res.status(http_status_codes_1.StatusCodes.CONFLICT);
                        throw new Error("Tag already exist");
                    }
                    else {
                        yield checktags.update({ Tag_Name: req.body.Tag_Name });
                    }
                }
            }
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "tag updated successfully",
                success: true,
                result: checktags,
            });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
    //   imported Tags
    importTagsCtr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log(req.file);
            if (!req.file) {
                return res
                    .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                    .json({ message: "No file uploaded" });
            }
            const filePath = path_1.default.join(__dirname, "../../uploads/", req.file.filename);
            const TagsData = [];
            console.log(`Processing file: ${filePath}`);
            // Read the CSV file
            fs_1.default.createReadStream(filePath)
                .pipe((0, csv_parser_1.default)())
                .on("data", (row) => {
                TagsData.push(row);
            })
                .on("end", () => __awaiter(void 0, void 0, void 0, function* () {
                let importedCount = 0;
                const errors = [];
                // Process the Tags data
                for (const data of TagsData) {
                    try {
                        // Basic validations
                        if (!data["Tags Name"]) {
                            errors.push(`Missing required fields for candidate: ${data["Tags Name"] || "Unknown"}`);
                            continue;
                        }
                        //find or create tag
                        // const [tag, created] = await Tag.findOrCreate({
                        //   where: {Tag_Name: data["Tags Name"]},
                        // });
                        const tag = yield Tag_1.default.findOne({
                            where: {
                                [sequelize_1.Op.or]: [{ Tag_Name: data["Tags Name"] }],
                            },
                        });
                        if (tag) {
                            errors.push(`Tag: ${data["Tags Name"]} already exists.`);
                            continue;
                        }
                        const created = yield Tag_1.default.create({
                            Tag_Name: data["Tags Name"],
                            Created_By: req.user.id,
                        });
                        if (created) {
                            importedCount++;
                        }
                    }
                    catch (err) {
                        errors.push(`Failed to import Tag: ${data["Tags Name"]}. Error: ${err.message}`);
                    }
                }
                // Delete the file after processing
                fs_1.default.unlinkSync(filePath);
                // Return the response with success and error details
                return res.status(http_status_codes_1.StatusCodes.OK).json({
                    success: true,
                    message: `${importedCount} Tags imported successfully`,
                    result: TagsData,
                    importedCount,
                    errors,
                });
            }));
        }
        catch (error) {
            return res
                .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: error.message });
        }
    })),
    returntagsCsvFile: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const tagsFields = ["Tags Name"];
            // Generate a CSV file dynamically
            const filePath = path_1.default.join(__dirname, "../../uploads/template.csv");
            // Create a write stream to save the CSV
            const writeStream = fs_1.default.createWriteStream(filePath);
            // Write data using fast-csv
            const csvStream = (0, fast_csv_1.format)({ headers: true });
            csvStream.pipe(writeStream);
            // Write header columns to CSV
            csvStream.write(tagsFields);
            // Optionally include a few rows as sample data
            csvStream.end();
            writeStream.on("finish", () => {
                // Send the CSV file as a response
                res.download(filePath, "tags-template.csv", (err) => {
                    if (err) {
                        console.error(err);
                        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                            message: "Failed to download template CSV",
                        });
                    }
                });
            });
        }
        catch (error) {
            console.error(error);
            res
                .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ error: error.message });
        }
    })),
};
exports.default = TagCtr;
