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
const Designation_1 = __importDefault(require("../../modals/Designation/Designation"));
const Candidate_1 = __importDefault(require("../../modals/Candidate/Candidate"));
const http_status_codes_1 = require("http-status-codes");
const csv_parser_1 = __importDefault(require("csv-parser"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sequelize_1 = require("sequelize");
const fast_csv_1 = require("fast-csv");
const CandidateCtr = {
    // create Candidate ctr
    createCandidatectr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, resumeTitle, contactNumber, whatsappNumber, email, workExp, currentCTC, currentLocation, state, preferredLocation, dob, designation, UserId, } = req.body;
            //check designation existance if it is not exist then find or create
            const checkDesignation = yield Designation_1.default.findOrCreate({
                where: { title: designation },
            });
            // check User existance
            // const userExists: number | unknown = await User.findByPk(req.user);
            // if (!userExists) {
            //   res.status(404);
            //   throw new Error("User Not Found Please Login !");
            // }
            //check Candidate existance
            const checkCandidate = yield Candidate_1.default.findOne({ where: { email } });
            if (checkCandidate) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST);
                throw new Error("Candidate Already Exist");
            }
            const itemresp = yield Candidate_1.default.create({
                name,
                resumeTitle,
                contactNumber,
                whatsappNumber,
                email,
                workExp,
                currentCTC,
                currentLocation,
                state,
                preferredLocation,
                dob,
                designationId: checkDesignation[0].id,
                UserId,
            });
            if (!itemresp) {
                res.status(400);
                throw new Error("Bad Request");
            }
            return res
                .status(http_status_codes_1.StatusCodes.OK)
                .json({ success: true, message: "Candidate created Successfully" });
        }
        catch (error) {
            throw new Error(error);
        }
    })),
    //   fetch Candidate ctr
    fetchCandidateCtr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // const userExists: string | any = await User.findByPk(req.user);
            // if (!userExists) {
            //   res.status(404);
            //   throw new Error("User Not Found Please Login !");
            // }
            const fetchitems = yield Candidate_1.default.findAll();
            if (!fetchitems) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND);
                throw new Error("");
            }
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "Fetch Candidate Successfully",
                success: true,
                result: fetchitems,
            });
        }
        catch (error) {
            throw new Error(error);
        }
    })),
    //   remove Candidate ctr
    reomveCandidateCtr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // const userExists: string | any = await User.findByPk(req.user);
            // if (!userExists) {
            //   res.status(404);
            //   throw new Error("User Not Found Please Login !");
            // }
            const removeitem = yield Candidate_1.default.findByPk(req.params.id);
            if (!removeitem) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND);
                throw new Error("Item not Found");
            }
            else {
                removeitem.destroy();
            }
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "Candidate items remove successfully",
                success: true,
            });
        }
        catch (error) {
            throw new Error(error);
        }
    })),
    //   edit desingation ctr
    editCandidateCtr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // const userExists: string | any = await User.findByPk(req.user);
            // if (!userExists) {
            //   res.status(404);
            //   throw new Error("User Not Found Please Login !");
            // }
            const checkDesigation = yield Candidate_1.default.findByPk(req.params.id);
            if (!checkDesigation) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST);
                throw new Error("Bad Request");
            }
            //check if Candidate exist
            yield checkDesigation.update(req.body);
            return res
                .status(http_status_codes_1.StatusCodes.OK)
                .json({ message: "Update Candidate succesfully", success: true });
        }
        catch (error) {
            throw new Error(error);
        }
    })),
    importCandidates: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!req.file) {
                return res
                    .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                    .json({ message: "No file uploaded" });
            }
            const filePath = path_1.default.join(__dirname, "../../uploads/", req.file.filename);
            const candidatesData = [];
            console.log(`Processing file: ${filePath}`);
            // Read the CSV file
            fs_1.default.createReadStream(filePath)
                .pipe((0, csv_parser_1.default)())
                .on("data", (row) => {
                candidatesData.push(row);
            })
                .on("end", () => __awaiter(void 0, void 0, void 0, function* () {
                let importedCount = 0;
                const errors = [];
                // Process the candidates data
                for (const data of candidatesData) {
                    try {
                        // Basic validations
                        if (!data["Candidate Name"] ||
                            !data.Email ||
                            !data["Contact No"] ||
                            !data["Whatsapp No"] ||
                            !data.Designation) {
                            errors.push(`Missing required fields for candidate: ${data["Candidate Name"] || "Unknown"}`);
                            continue;
                        }
                        // Validate email format
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(data.Email)) {
                            errors.push(`Invalid email format for candidate: ${data["Candidate Name"]} (${data.Email})`);
                            continue;
                        }
                        // Validate phone numbers (basic check)
                        const phoneRegex = /^\d{10}$/;
                        if (!phoneRegex.test(data["Contact No"]) ||
                            !phoneRegex.test(data["Whatsapp No"])) {
                            errors.push(`Invalid contact number(s) for candidate: ${data["Candidate Name"]}`);
                            continue;
                        }
                        // Check if Designation exists or create a new one
                        const [designation] = yield Designation_1.default.findOrCreate({
                            where: { title: data.Designation },
                        });
                        // Check if Candidate already exists (by email or contact number)
                        const existingCandidate = yield Candidate_1.default.findOne({
                            where: {
                                [sequelize_1.Op.or]: [
                                    { email: data.Email },
                                    { contactNumber: data["Contact No"] },
                                ],
                            },
                        });
                        if (existingCandidate) {
                            errors.push(`Candidate already exists: ${data["Candidate Name"]} (${data.Email})`);
                            continue;
                        }
                        // Create new Candidate
                        yield Candidate_1.default.create({
                            name: data["Candidate Name"],
                            resumeTitle: data["Resume Title"] || "",
                            contactNumber: data["Contact No"],
                            whatsappNumber: data["Whatsapp No"],
                            email: data.Email,
                            workExp: data["Work Exp"] || "",
                            currentCTC: data["Current Annual Salary / CTC"],
                            currentLocation: data["Current Location"] || "",
                            state: data.State || "",
                            preferredLocation: data["Preferred Location"] || "",
                            dob: new Date(data["Age/Date of Birth"]),
                            designationId: designation.id,
                            UserId: req.body.UserId || 1, // Assuming UserId is passed in the request body
                        });
                        importedCount++;
                    }
                    catch (err) {
                        errors.push(`Failed to import candidate: ${data["Candidate Name"]}. Error: ${err.message}`);
                    }
                }
                // Delete the file after processing
                fs_1.default.unlinkSync(filePath);
                // Return the response with success and error details
                return res.status(http_status_codes_1.StatusCodes.OK).json({
                    message: `${importedCount} candidates imported successfully`,
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
    returnCandidateCsvFile: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const candidateFields = [
                "Candidate Name",
                "Resume Title",
                "Contact No",
                "Whatsapp No",
                "Email",
                "Work Exp",
                "Current Annual Salary / CTC",
                "Current Location",
                "State",
                "Preferred Location",
                "Age/Date of Birth",
                "Designation",
            ];
            // Generate a CSV file dynamically
            const filePath = path_1.default.join(__dirname, "../../uploads/template.csv");
            // Create a write stream to save the CSV
            const writeStream = fs_1.default.createWriteStream(filePath);
            // Write data using fast-csv
            const csvStream = (0, fast_csv_1.format)({ headers: true });
            csvStream.pipe(writeStream);
            // Write header columns to CSV
            csvStream.write(candidateFields);
            // Optionally include a few rows as sample data
            csvStream.end();
            writeStream.on("finish", () => {
                // Send the CSV file as a response
                res.download(filePath, "candidate-template.csv", (err) => {
                    if (err) {
                        console.error(err);
                        res
                            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                            .json({ message: "Failed to download template CSV" });
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
exports.default = CandidateCtr;
