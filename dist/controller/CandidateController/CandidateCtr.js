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
const Designation_1 = __importDefault(require("../../modals/Designation/Designation"));
const Candidate_1 = __importDefault(require("../../modals/Candidate/Candidate"));
const http_status_codes_1 = require("http-status-codes");
const csv_parser_1 = __importDefault(require("csv-parser"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sequelize_1 = require("sequelize");
const fast_csv_1 = require("fast-csv");
const dbconfig_1 = __importDefault(require("../../dbconfig/dbconfig"));
const Education_1 = __importDefault(require("../../modals/Eduction/Education"));
// import CandidateReasons from '../../modals/CandidateReasons/CandidateReasons';
const CandidateTags_1 = __importDefault(require("../../modals/CandidateTags/CandidateTags"));
const Tag_1 = __importDefault(require("../../modals/Tag/Tag"));
const User_1 = __importDefault(require("../../modals/User/User"));
const Client_1 = __importDefault(require("../../modals/Client/Client"));
const ClientTags_1 = __importDefault(require("../../modals/ClientTags"));
const ReasonSaveAnswer_1 = __importDefault(require("../../modals/ReasonSaveAnswer/ReasonSaveAnswer"));
const ReasonForLeaving_1 = __importDefault(require("../../modals/ReasonForLeaving/ReasonForLeaving"));
const ReasonAnswer_1 = __importDefault(require("../../modals/ReasonAnswer/ReasonAnswer"));
const Degree_1 = __importDefault(require("../../modals/DegreeProgram/Degree"));
const CandidateCtr = {
    // create Candidate ctr
    createCandidatectr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // const transaction: Transaction = await sequelize.transaction();
        try {
            const { name, resumeTitle, contactNumber, whatsappNumber, email, workExp, currentCTC, currentLocation, state, currentEmployeer, postalAddress, preferredLocation, dob, remarks, designationId, country, city, tags, education } = req.body;
            if (!name || !email || !contactNumber || !whatsappNumber) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST);
                throw new Error("Bad Request");
            }
            const checkDesignation = yield Designation_1.default.findByPk(designationId);
            if (!checkDesignation) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST);
                throw new Error("Designation Not Found");
            }
            //if email or contact number already exist
            const existingCandidate = yield Candidate_1.default.findOne({
                where: {
                    [sequelize_1.Op.or]: [{ email }, { contactNumber }]
                }
            });
            if (existingCandidate) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST);
                throw new Error("Candidate already exists");
            }
            const newCandidate = yield Candidate_1.default.create({ name, resumeTitle, contactNumber, whatsappNumber, email, workExp, currentCTC, currentLocation, state, currentEmployeer, postalAddress, preferredLocation, dob, remarks, designationId, country, city, lastActive: new Date(), UserId: req.user.id });
            //now we need to store candidatetags and education
            if (tags) {
                //first check if tags are present
                if (tags.length === 0) {
                    res.status(http_status_codes_1.StatusCodes.BAD_REQUEST);
                    throw new Error("Tags are required");
                }
                //check tag is present or not in tag
                for (const tag of tags) {
                    yield CandidateTags_1.default.create({
                        candidateId: newCandidate.id,
                        tagId: tag.id
                    });
                }
            }
            // Store education records if present
            if (education) {
                // education: { ugCourse: 'dfg', pgCourse: 'edrtgh', postPgCourse: 'rtgyh' }
                const educationData = {
                    candidateId: newCandidate.id,
                    ugCourse: education.ugCourse || null,
                    pgCourse: education.pgCourse || null,
                    postPgCourse: education.postPgCourse || null
                };
                const newEducation = yield Education_1.default.create(educationData);
            }
            // we need to append the tags and education into newCandidate extend the newCandidate object
            const findUpdatedCandidate = yield Candidate_1.default.findOne({
                where: { id: newCandidate.id },
                include: [
                    {
                        model: Designation_1.default,
                        as: "designation",
                        attributes: ["id", "title"],
                    },
                    {
                        model: Tag_1.default,
                        as: "tags",
                        attributes: ["id", "Tag_Name"],
                        through: { attributes: [] },
                    },
                    {
                        model: Education_1.default,
                        as: "education",
                        attributes: ["ugCourse", "pgCourse", "postPgCourse"],
                    },
                    {
                        model: ReasonSaveAnswer_1.default,
                        as: "reasons",
                    }
                ]
            });
            return res.status(http_status_codes_1.StatusCodes.CREATED).json({
                message: "Candidate created successfully",
                success: true,
                result: findUpdatedCandidate
            });
        }
        catch (error) {
            throw new Error(error);
        }
    })),
    //   fetch Candidate ctr
    // fetchCandidateCtr: asyncHandler(
    //   async (req: CustomRequest, res: Response): Promise<any> => {
    //     try {
    //       const userExists: string | any = await User.findOne({
    //         where: { id: req.user.id },
    //         attributes: { exclude: ["Password"] },
    //       });
    //       if (!userExists) {
    //         res.status(404);
    //         throw new Error("User Not Found Please Login !");
    //       }
    //       let fetchitems;
    //       const { page = 1, limit = 20, ...filters } = req.query;
    //       const offset = (Number(page) - 1) * Number(limit);
    //       // Separate whereCondition for main table
    //       let whereCondition: any = {};
    //       // Basic candidate filters
    //       const candidateFields = [
    //         'name', 'email', 'contactNumber', 'whatsappNumber', 'resumeTitle',
    //         'workExp', 'currentCTC', 'currentLocation', 'state', 'preferredLocation',
    //         'dob', 'age', 'currentEmployeer', 'postalAddress', 'country', 'city'
    //       ];
    //       candidateFields.forEach(field => {
    //         if (filters[field]) {
    //           whereCondition[field] = { [Op.like]: `%${filters[field]}%` };
    //         }
    //       });
    //       // Initialize include conditions
    //       let includeConditions: any[] = [];
    //       // Designation include with filter
    //       const designationInclude: any = {
    //         model: Designation,
    //         as: "designation",
    //         attributes: ["id", "title"],
    //       };
    //       if (filters.designation) {
    //         designationInclude.where = {
    //           title: { [Op.like]: `%${filters.designation}%` }
    //         };
    //       }
    //       includeConditions.push(designationInclude);
    //       // Education include with filters
    //       const educationInclude: any = {
    //         model: Education,
    //         as: "education",
    //         attributes: ["ugCourse", "pgCourse", "postPgCourse"],
    //       };
    //       if (filters.ugCourse || filters.pgCourse || filters.postPgCourse) {
    //         educationInclude.where = {};
    //         if (filters.ugCourse) {
    //           educationInclude.where.ugCourse = { [Op.like]: `%${filters.ugCourse}%` };
    //         }
    //         if (filters.pgCourse) {
    //           educationInclude.where.pgCourse = { [Op.like]: `%${filters.pgCourse}%` };
    //         }
    //         if (filters.postPgCourse) {
    //           educationInclude.where.postPgCourse = { [Op.like]: `%${filters.postPgCourse}%` };
    //         }
    //       }
    //       includeConditions.push(educationInclude);
    //       // Tags include with filter
    //       let tagInclude: any;
    //       if (userExists.Type === "client") {
    //         const clientId = await Client.findOne({
    //           where: { userId: req.user.id },
    //         });
    //         if (!clientId) {
    //           res.status(StatusCodes.NOT_FOUND);
    //           throw new Error("Client Not Found");
    //         }
    //         const clientTags = await ClientTags.findAll({
    //           where: { ClientId: clientId.id },
    //           attributes: ["tagId"],
    //         });
    //         if (!clientTags) {
    //           res.status(StatusCodes.NOT_FOUND);
    //           throw new Error("Client Tags Not Found");
    //         }
    //         tagInclude = {
    //           model: Tag,
    //           as: "tags",
    //           where: {
    //             [Op.or]: {
    //               id: clientTags.map((tag: any) => tag.tagId),
    //               Created_By: req.user.id,
    //             },
    //           },
    //         };
    //       } else if (userExists.Type === "superadmin") {
    //         tagInclude = {
    //           model: Tag,
    //           as: "tags",
    //           attributes: ["Tag_Name"],
    //           through: { attributes: [] },
    //         };
    //       }
    //       // Add tag name filter if provided
    //       if (filters.tagName) {
    //         tagInclude.where = {
    //           ...tagInclude.where,
    //           Tag_Name: { [Op.like]: `%${filters.tagName}%` }
    //         };
    //       }
    //       includeConditions.push(tagInclude);
    //       // Reasons include with filter
    //       const reasonsInclude: any = {
    //         model: ReasonSaveAnswer,
    //         as: "reasons",
    //         required: filters.reasons || filters.reasonAnswer ? true : false,
    //         include: [
    //           {
    //             model: ReasonsForLeaving,
    //             as: "reason",
    //             attributes: ["reason", "id"],
    //             required: filters.reasons ? true : false,
    //             where: filters.reasons ? {
    //               reason: { [Op.like]: `%${filters.reasons}%` }
    //             } : undefined
    //           },
    //           {
    //             model: ReasonAnswer,
    //             attributes: ["Reason_answer", "id"],
    //             required: filters.reasonAnswer ? true : false,
    //             where: filters.reasonAnswer ? {
    //               Reason_answer: { [Op.like]: `%${filters.reasonAnswer}%` }
    //             } : undefined
    //           }
    //         ],
    //         attributes: { exclude: ["createdAt", "updatedAt"] }
    //       };
    //       includeConditions.push(reasonsInclude);
    //       // Execute the query with all conditions
    //       fetchitems = await Candidate.findAndCountAll({
    //         where: whereCondition,
    //         include: includeConditions,
    //         offset,
    //         limit: Number(limit),
    //         distinct: true,
    //         subQuery: false
    //       });
    //       if (!fetchitems || fetchitems.count === 0) {
    //         res.status(StatusCodes.NOT_FOUND);
    //         throw new Error("Candidates Not Found");
    //       }
    //       return res.status(StatusCodes.OK).json({
    //         message: "Fetch Candidate Successfully",
    //         success: true,
    //         result: fetchitems.rows,
    //         totalCount: fetchitems.count,
    //         totalPages: Math.ceil(fetchitems.count / Number(limit)),
    //         currentPage: Number(page),
    //       });
    //     } catch (error: any) {
    //       console.error(error);
    //       throw new Error(error);
    //     }
    //   }
    // )
    fetchCandidateCtr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userExists = yield User_1.default.findOne({
                where: { id: req.user.id },
                attributes: { exclude: ["Password"] },
            });
            if (!userExists) {
                res.status(404);
                throw new Error("User Not Found Please Login !");
            }
            const _a = req.query, { page = 1, limit = 20 } = _a, filters = __rest(_a, ["page", "limit"]);
            const offset = (Number(page) - 1) * Number(limit);
            // Separate whereCondition for main table
            let whereCondition = {};
            // Basic candidate filters
            const candidateFields = [
                'name', 'email', 'contactNumber', 'whatsappNumber', 'resumeTitle',
                'workExp', 'currentCTC', 'currentLocation', 'state', 'preferredLocation',
                'dob', 'age', 'currentEmployeer', 'postalAddress', 'country', 'city', 'UserId'
            ];
            candidateFields.forEach(field => {
                if (filters[field]) {
                    whereCondition[field] = { [sequelize_1.Op.like]: `%${filters[field]}%` };
                }
            });
            const { workExpRange } = filters;
            if (workExpRange) {
                const [minExp, maxExp] = workExpRange.split('-').map(Number);
                if (!isNaN(minExp) && !isNaN(maxExp)) {
                    whereCondition.workExp = dbconfig_1.default.where(dbconfig_1.default.cast(dbconfig_1.default.fn('REPLACE', dbconfig_1.default.col('workExp'), ' Y', ''), 'UNSIGNED'), { [sequelize_1.Op.between]: [minExp, maxExp] });
                }
            }
            // Initialize include conditions
            let includeConditions = [];
            // Designation include with filter
            const designationInclude = {
                model: Designation_1.default,
                as: "designation",
                attributes: ["id", "title"],
            };
            if (filters.designation) {
                designationInclude.where = {
                    title: { [sequelize_1.Op.like]: `%${filters.designation}%` }
                };
            }
            includeConditions.push(designationInclude);
            // Education include with filters
            const educationInclude = {
                model: Education_1.default,
                as: "education",
                attributes: ["ugCourse", "pgCourse", "postPgCourse"],
            };
            if (filters.ugCourse || filters.pgCourse || filters.postPgCourse) {
                educationInclude.where = {};
                if (filters.ugCourse) {
                    educationInclude.where.ugCourse = { [sequelize_1.Op.like]: `%${filters.ugCourse}%` };
                }
                if (filters.pgCourse) {
                    educationInclude.where.pgCourse = { [sequelize_1.Op.like]: `%${filters.pgCourse}%` };
                }
                if (filters.postPgCourse) {
                    educationInclude.where.postPgCourse = { [sequelize_1.Op.like]: `%${filters.postPgCourse}%` };
                }
            }
            includeConditions.push(educationInclude);
            // Tags include with filter
            let tagInclude;
            if (userExists.Type === "client") {
                const clientId = yield Client_1.default.findOne({
                    where: { userId: req.user.id },
                });
                if (!clientId) {
                    res.status(http_status_codes_1.StatusCodes.NOT_FOUND);
                    throw new Error("Client Not Found");
                }
                const clientTags = yield ClientTags_1.default.findAll({
                    where: { ClientId: clientId.id },
                    attributes: ["tagId"],
                });
                if (!clientTags) {
                    res.status(http_status_codes_1.StatusCodes.NOT_FOUND);
                    throw new Error("Client Tags Not Found");
                }
                tagInclude = {
                    model: Tag_1.default,
                    as: "tags",
                    where: {
                        [sequelize_1.Op.or]: {
                            id: clientTags.map((tag) => tag.tagId),
                            Created_By: req.user.id,
                        },
                    },
                };
            }
            else if (userExists.Type === "superadmin") {
                tagInclude = {
                    model: Tag_1.default,
                    as: "tags",
                    attributes: ["id", "Tag_Name"],
                    through: { attributes: [] },
                };
            }
            if (filters.tagName) {
                tagInclude.where = Object.assign(Object.assign({}, tagInclude.where), { Tag_Name: { [sequelize_1.Op.like]: `%${filters.tagName}%` } });
            }
            includeConditions.push(tagInclude);
            // Reasons include with filter
            const reasonsInclude = {
                model: ReasonSaveAnswer_1.default,
                as: "reasons",
                required: filters.reasons || filters.reasonAnswer ? true : false,
                include: [
                    {
                        model: ReasonAnswer_1.default,
                        attributes: ["Reason_answer", "id"],
                        required: filters.reasonAnswer ? true : false,
                        where: filters.reasonAnswer ? {
                            Reason_answer: { [sequelize_1.Op.like]: `%${filters.reasonAnswer}%` }
                        } : undefined
                    }
                ],
                attributes: { exclude: ["createdAt", "updatedAt"] }
            };
            includeConditions.push(reasonsInclude);
            // First get the total count with a separate query
            const totalCount = yield Candidate_1.default.count({
                where: whereCondition,
                include: includeConditions,
                distinct: true,
            });
            // Then get the paginated results
            const fetchitems = yield Candidate_1.default.findAll({
                where: whereCondition,
                include: includeConditions,
                offset,
                limit: Number(limit),
                order: [['id', 'ASC']], // Add consistent ordering
            });
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "Fetch Candidate Successfully",
                success: true,
                result: fetchitems,
                totalCount,
                totalPages: Math.ceil(totalCount / Number(limit)),
                currentPage: Number(page),
            });
        }
        catch (error) {
            console.error(error);
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
            const { name, resumeTitle, contactNumber, whatsappNumber, email, workExp, currentCTC, currentLocation, state, currentEmployeer, postalAddress, preferredLocation, dob, remarks, designationId, country, city, tags, education } = req.body;
            const checkDesignation = yield Designation_1.default.findByPk(designationId);
            if (!checkDesignation) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST);
                throw new Error("Designation Not Found");
            }
            const checkCandidate = yield Candidate_1.default.findByPk(req.params.id);
            if (!checkCandidate) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST);
                throw new Error("Candidate Not Found");
            }
            yield checkCandidate.update({ name, resumeTitle, contactNumber, whatsappNumber, email, workExp, currentCTC, currentLocation, state, currentEmployeer, postalAddress, preferredLocation, dob, remarks, designationId, country, city, lastActive: new Date(), UserId: req.user.id });
            //now we need to store candidatetags and education
            if (tags) {
                // Remove existing tags
                yield CandidateTags_1.default.destroy({ where: { candidateId: checkCandidate.id } });
                for (const tag of tags) {
                    yield CandidateTags_1.default.create({
                        candidateId: checkCandidate.id,
                        tagId: tag.id
                    });
                }
            }
            // Store education records if present
            if (education) {
                // Remove existing education
                yield Education_1.default.destroy({ where: { candidateId: checkCandidate.id } });
                const educationData = {
                    candidateId: checkCandidate.id,
                    ugCourse: education.ugCourse || null,
                    pgCourse: education.pgCourse || null,
                    postPgCourse: education.postPgCourse || null
                };
                const newEducation = yield Education_1.default.create(educationData);
            }
            const findUpdatedCandidate = yield Candidate_1.default.findOne({
                where: { id: checkCandidate.id },
                include: [
                    {
                        model: Designation_1.default,
                        as: "designation",
                        attributes: ["id", "title"],
                    },
                    {
                        model: Tag_1.default,
                        as: "tags",
                        attributes: ["id", "Tag_Name"],
                        through: { attributes: [] },
                    },
                    {
                        model: Education_1.default,
                        as: "education",
                        attributes: ["ugCourse", "pgCourse", "postPgCourse"],
                    },
                    {
                        model: ReasonSaveAnswer_1.default,
                        as: "reasons",
                        include: [
                            {
                                model: ReasonAnswer_1.default,
                            }
                        ],
                    }
                ]
            });
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "Candidate updated successfully",
                success: true,
                result: findUpdatedCandidate
            });
        }
        catch (error) {
            throw new Error(error);
        }
    })),
    //   importCandidates: asyncHandler(
    //     async (req: CustomRequest, res: Response): Promise<any> => {
    //       try {
    //         if (!req.file) {
    //           return res
    //             .status(StatusCodes.BAD_REQUEST)
    //             .json({message: "No file uploaded"});
    //         }
    //         const filePath = path.join(
    //           __dirname,
    //           "../../uploads/",
    //           req.file.filename
    //         );
    //         const candidatesData: any[] = [];
    //         console.log(`Processing file: ${filePath}`);
    //         // Read the CSV file
    //         fs.createReadStream(filePath)
    //           .pipe(csv())
    //           .on("data", (row: any) => {
    //             candidatesData.push(row);
    //           })
    //           .on("end", async () => {
    //             let importedCount = 0;
    //             const errors: string[] = [];
    //             // Process the candidates data
    //             for (const data of candidatesData) {
    //               let educationData:any ={
    //                 candidateId:0,
    //                 ugCourse: "",
    //                 pgCourse: "",
    //                 postPgCourse: ""
    //               }
    //               try {
    //                 // Basic validations
    //                 if (
    //                   !data["Candidate Name"] ||
    //                   !data.Email ||
    //                   !data["Contact No"] ||
    //                   !data["Whatsapp No"] ||
    //                   !data.Designation
    //                 ) {
    //                   errors.push(
    //                     `Missing required fields for candidate: ${
    //                       data["Candidate Name"] || "Unknown"
    //                     }`
    //                   );
    //                   continue;
    //                 }
    //                 // Validate email format
    //                 if (!/^\S+@\S+\.\S+$/.test(data.Email)) {
    //                   errors.push(
    //                     `Invalid email format for candidate: ${data["Candidate Name"]}`
    //                   );
    //                   continue;
    //                 }
    //                 // validate Contact Number and Whatsapp Number it should be number and length should be 10
    //                 if (!/^\d{10}$/.test(data["Contact No"])) {
    //                   errors.push(
    //                     `Invalid Contact Number for candidate: ${data["Candidate Name"]}`
    //                   );
    //                   continue;
    //                 }
    //                 if (!/^\d{10}$/.test(data["Whatsapp No"])) {
    //                   errors.push(
    //                     `Invalid Whatsapp Number for candidate: ${data["Candidate Name"]}`
    //                   );
    //                   continue;
    //                 }
    //                 // workExp should be look like this for example 2 Y or 2.5 Y
    //                 if (!/^\d+(\.\d+)? Y$/.test(data["Work Exp"])) {
    //                   errors.push(
    //                     `Invalid Work Experience for candidate: ${data["Candidate Name"]}. Please provide in Y format. For example 2 Y or 2.5 Y`
    //                   );
    //                   continue;
    //                 }
    //                 // Current CTC should be look like this for example 2.5 LPA or 5 LPA
    //                 if (!/^\d+(\.\d+)? LPA$/.test(data["Current Annual Salary / CTC"])) {
    //                   errors.push(
    //                     `Invalid Current CTC for candidate: ${data["Candidate Name"]}.Please provide in LPA format.For example 2.5 LPA`
    //                   );
    //                   continue;
    //                 }
    //                 // date of birth should be in this format 2021-09-01
    //                 if (!/^\d{4}-\d{2}-\d{2}$/.test(data["Date of Birth"])) {
    //                   errors.push(
    //                     `Invalid Date of Birth for candidate: ${data["Candidate Name"]}. Please provide in YYYY-MM-DD format`
    //                   );
    //                   continue;
    //                 }
    //                 //validate the UG,PG,Post PG should be present in degree table
    //                 if (data.UG) {
    //                   const checkUG = await Degree.findOne({
    //                     where: { name: data.UG },
    //                   });
    //                   if (checkUG) {
    //                     educationData.ugCourse = checkUG.name;
    //                   }
    //                   if (!checkUG) {
    //                     errors.push(
    //                       `Invalid UG Degree for candidate: ${data["Candidate Name"]}. Please provide a valid UG degree`
    //                     );
    //                     continue;
    //                   }
    //                 }
    //                 if (data.PG) {
    //                   const checkPG = await Degree.findOne({
    //                     where: { name: data.PG },
    //                   });
    //                   if (checkPG) {
    //                     educationData.pgCourse = checkPG.name;
    //                   }
    //                   if (!checkPG) {
    //                     errors.push(
    //                       `Invalid PG Degree for candidate: ${data["Candidate Name"]}. Please provide a valid PG degree`
    //                     );
    //                     continue;
    //                   }
    //                 }
    //                 if (data["Post PG"]) {
    //                   const checkPostPG = await Degree.findOne({
    //                     where: { name: data["Post PG"] },
    //                   });
    //                   if (checkPostPG) {
    //                     educationData.postPgCourse = checkPostPG.name;
    //                   }
    //                   if (!checkPostPG) {
    //                     errors.push(
    //                       `Invalid Post PG Degree for candidate: ${data["Candidate Name"]}. Please provide a valid Post PG degree`
    //                     );
    //                     continue;
    //                   }
    //                 }
    //                 // Check if Designation exists or create a new one
    //                 const [designation] = await Designation.findOrCreate({
    //                   where: {title: data.Designation},
    //                 });
    //                 // Check if Candidate already exists (by email or contact number)
    //                 const existingCandidate = await Candidate.findOne({
    //                   where: {
    //                     [Op.or]: [
    //                       {email: data.Email},
    //                       {contactNumber: data["Contact No"]},
    //                     ],
    //                   },
    //                 });
    //                 if (existingCandidate) {
    //                   errors.push(
    //                     `Candidate already exists: ${data["Candidate Name"]} (${data.Email})`
    //                   );
    //                   continue;
    //                 }
    //                 const newCandidate = await Candidate.create({
    //                   name: data["Candidate Name"],
    //                   resumeTitle: data["Resume Title"] || "",
    //                   contactNumber: data["Contact No"],
    //                   whatsappNumber: data["Whatsapp No"],
    //                   email: data.Email,
    //                   workExp: data["Work Exp"] || "",
    //                   currentCTC: data["Current Annual Salary / CTC"],
    //                   currentLocation: data["Current Location"] || "",
    //                   state: data.State || "",
    //                   currentEmployeer:data["currentEmployeer"] || "",
    //                   postalAddress: data["Postal Address"] || "",
    //                   preferredLocation: data["Preferred Location"] || "",
    //                   dob: new Date(data["Date of Birth"]),
    //                   designationId: designation.id,
    //                   lastActive: new Date(),
    //                   remarks: data["Remarks"] || "",
    //                   // regionId: 1,
    //                   country: data.Country || "",
    //                   city: data.City || "",
    //                   UserId: req.user.id,
    //                 });
    //                 if (newCandidate) {
    //                   educationData.candidateId = newCandidate.id;
    //                 }
    //                 if (data.Tags && typeof data.Tags === 'string') {
    //   // Split the string by commas, then trim whitespace around each tag
    //   const tags: string[] = data.Tags.split(',').map((tag: string) => tag.trim());
    //   // Iterate over the array of tags
    //   for (const tagName of tags) {
    //     // Ensure the tag is not an empty string
    //     if (tagName) {
    //       try {
    //         // Find or create the tag in the Tag table
    //         const [tagData] = await Tag.findOrCreate({
    //           where: { Tag_Name: tagName,Created_By:req.user.id },
    //         });
    //         // Create the association between the candidate and the tag
    //         await CandidateTags.create({
    //           candidateId: newCandidate.id,
    //           tagId: tagData.id
    //         });
    //         console.log(`Tag "${tagName}" processed successfully.`);
    //       } catch (err) {
    //         console.error(`Error processing tag "${tagName}":`, err);
    //       }
    //     } else {
    //       console.warn('Empty tag encountered, skipping.');
    //     }
    //   }
    // } else {
    //   console.warn('Invalid Tags format: Expected a comma-separated string.');
    // }
    //   // Only create Education data if at least one course is provided
    //   // const educationData = {
    //   //   candidateId: newCandidate.id,
    //   //   ugCourse: data.UG || null,  // Use `null` if the course is not provided
    //   //   pgCourse: data.PG || null,
    //   //   postPgCourse: data['Post PG'] || null
    //   // };
    //   try {
    //     // Only create Education entry if at least one course is provided
    //     await Education.create(educationData);
    //     console.log('Education data successfully added for candidate', newCandidate.id);
    //   } catch (error) {
    //     console.error('Error adding education data:', error);
    //   }
    //                 importedCount++;
    //               } catch (err: any) {
    //                 errors.push(
    //                   `Failed to import candidate: ${data["Candidate Name"]}. Error: ${err.message}`
    //                 );
    //               }
    //             }
    //             // Delete the file after processing
    //             fs.unlinkSync(filePath);
    //             // Return the response with success and error details
    //             if (errors.length > 0) {
    //               return res.status(StatusCodes.PARTIAL_CONTENT).json({
    //                 message: `${importedCount} Candidate(s) Successfully Imported, but some failed.`,
    //                 success: true,
    //                 errors, // List of errors for failed candidates
    //                 importedCount, // Count of successful imports
    //                 failedCount: errors.length, // Count of failed imports
    //               });
    //             } else {
    //               return res.status(StatusCodes.CREATED).json({
    //                 message: `${importedCount} Candidate(s) Successfully Imported`,
    //                 success: true,
    //                 errors: [], // No errors in the success case
    //                 importedCount, // Count of successfully imported candidates
    //               });
    //             }
    //           });
    //       } catch (error: any) {
    //         return res
    //           .status(StatusCodes.INTERNAL_SERVER_ERROR)
    //           .json({message: error.message});
    //       }
    //     }
    //   ),
    importCandidates: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const whoisUser = yield User_1.default.findOne({
                where: { id: req.user.id },
                attributes: { exclude: ["Password"] },
            });
            if (!whoisUser) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND);
                throw new Error("User Not Found");
            }
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
                let updatedCount = 0;
                const errors = [];
                // Process the candidates data
                for (const data of candidatesData) {
                    let educationData = {
                        candidateId: 0,
                        ugCourse: "",
                        pgCourse: "",
                        postPgCourse: ""
                    };
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
                        if (!/^\S+@\S+\.\S+$/.test(data.Email)) {
                            errors.push(`Invalid email format for candidate: ${data["Candidate Name"]}`);
                            continue;
                        }
                        // validate Contact Number and Whatsapp Number it should be number and length should be 10
                        if (!/^\d{10}$/.test(data["Contact No"])) {
                            errors.push(`Invalid Contact Number for candidate: ${data["Candidate Name"]}`);
                            continue;
                        }
                        if (!/^\d{10}$/.test(data["Whatsapp No"])) {
                            errors.push(`Invalid Whatsapp Number for candidate: ${data["Candidate Name"]}`);
                            continue;
                        }
                        // workExp should be look like this for example 2 Y or 2.5 Y
                        if (!/^\d+(\.\d+)? Y$/.test(data["Work Exp"])) {
                            errors.push(`Invalid Work Experience for candidate: ${data["Candidate Name"]}. Please provide in Y format. For example 2 Y or 2.5 Y`);
                            continue;
                        }
                        // Current CTC should be look like this for example 2.5 LPA or 5 LPA
                        if (!/^\d+(\.\d+)? LPA$/.test(data["Current Annual Salary / CTC"])) {
                            errors.push(`Invalid Current CTC for candidate: ${data["Candidate Name"]}.Please provide in LPA format.For example 2.5 LPA`);
                            continue;
                        }
                        // date of birth should be in this format 2021-09-01
                        if (!/^\d{4}-\d{2}-\d{2}$/.test(data["Date of Birth"])) {
                            errors.push(`Invalid Date of Birth for candidate: ${data["Candidate Name"]}. Please provide in YYYY-MM-DD format`);
                            continue;
                        }
                        //validate the UG,PG,Post PG should be present in degree table
                        if (data.UG) {
                            const checkUG = yield Degree_1.default.findOne({
                                where: { name: data.UG },
                            });
                            if (checkUG) {
                                educationData.ugCourse = checkUG.name;
                            }
                            if (!checkUG) {
                                errors.push(`Invalid UG Degree for candidate: ${data["Candidate Name"]}. Please provide a valid UG degree`);
                                continue;
                            }
                        }
                        if (data.PG) {
                            const checkPG = yield Degree_1.default.findOne({
                                where: { name: data.PG },
                            });
                            if (checkPG) {
                                educationData.pgCourse = checkPG.name;
                            }
                            if (!checkPG) {
                                errors.push(`Invalid PG Degree for candidate: ${data["Candidate Name"]}. Please provide a valid PG degree`);
                                continue;
                            }
                        }
                        if (data["Post PG"]) {
                            const checkPostPG = yield Degree_1.default.findOne({
                                where: { name: data["Post PG"] },
                            });
                            if (checkPostPG) {
                                educationData.postPgCourse = checkPostPG.name;
                            }
                            if (!checkPostPG) {
                                errors.push(`Invalid Post PG Degree for candidate: ${data["Candidate Name"]}. Please provide a valid Post PG degree`);
                                continue;
                            }
                        }
                        // Check if Designation exists or create a new one
                        let designation;
                        if (whoisUser.Type === "superadmin") {
                            [designation] = yield Designation_1.default.findOrCreate({
                                where: { title: data.Designation },
                            });
                        }
                        else {
                            designation = yield Designation_1.default.findOne({
                                where: { title: data.Designation },
                            });
                        }
                        if (!designation) {
                            errors.push(`Invalid Designation for candidate: ${data["Candidate Name"]}. Please provide a valid Designation`);
                            continue;
                        }
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
                            if (whoisUser.Type === "client" && existingCandidate.UserId !== req.user.id) {
                                errors.push(`Candidate already exists: ${data["Candidate Name"]} (${data.Email})`);
                                continue;
                            }
                            // Update existing candidate
                            yield existingCandidate.update({
                                name: data["Candidate Name"],
                                resumeTitle: data["Resume Title"] || "",
                                contactNumber: data["Contact No"],
                                whatsappNumber: data["Whatsapp No"],
                                email: data.Email,
                                workExp: data["Work Exp"] || "",
                                currentCTC: data["Current Annual Salary / CTC"],
                                currentLocation: data["Current Location"] || "",
                                state: data.State || "",
                                currentEmployeer: data["currentEmployeer"] || "",
                                postalAddress: data["Postal Address"] || "",
                                preferredLocation: data["Preferred Location"] || "",
                                dob: new Date(data["Date of Birth"]),
                                designationId: designation.id,
                                lastActive: new Date(),
                                remarks: data["Remarks"] || "",
                                country: data.Country || "",
                                city: data.City || "",
                            });
                            educationData.candidateId = existingCandidate.id;
                            updatedCount++;
                        }
                        else {
                            // Create new candidate
                            const newCandidate = yield Candidate_1.default.create({
                                name: data["Candidate Name"],
                                resumeTitle: data["Resume Title"] || "",
                                contactNumber: data["Contact No"],
                                whatsappNumber: data["Whatsapp No"],
                                email: data.Email,
                                workExp: data["Work Exp"] || "",
                                currentCTC: data["Current Annual Salary / CTC"],
                                currentLocation: data["Current Location"] || "",
                                state: data.State || "",
                                currentEmployeer: data["currentEmployeer"] || "",
                                postalAddress: data["Postal Address"] || "",
                                preferredLocation: data["Preferred Location"] || "",
                                dob: new Date(data["Date of Birth"]),
                                designationId: designation.id,
                                lastActive: new Date(),
                                remarks: data["Remarks"] || "",
                                country: data.Country || "",
                                city: data.City || "",
                                UserId: req.user.id,
                            });
                            educationData.candidateId = newCandidate.id;
                            importedCount++;
                        }
                        // Only create Education entry if at least one course is provided
                        if (educationData.ugCourse || educationData.pgCourse || educationData.postPgCourse) {
                            const existingEducation = yield Education_1.default.findOne({
                                where: { candidateId: educationData.candidateId }
                            });
                            if (existingEducation) {
                                // Update existing education data
                                yield existingEducation.update(educationData);
                                console.log('Education data successfully updated for candidate', educationData.candidateId);
                            }
                            else {
                                // Create new education data
                                yield Education_1.default.create(educationData);
                                console.log('Education data successfully added for candidate', educationData.candidateId);
                            }
                        }
                        // Process tags
                        if (data.Tags && typeof data.Tags === 'string') {
                            const newTags = data.Tags.split(',').map((tag) => tag.trim());
                            // Destroy all existing tags for the candidate
                            yield CandidateTags_1.default.destroy({
                                where: { candidateId: educationData.candidateId }
                            });
                            // Add new tags
                            for (const tagName of newTags) {
                                if (tagName) {
                                    try {
                                        let tagData;
                                        tagData = yield Tag_1.default.findOne({
                                            where: { Tag_Name: tagName }
                                        });
                                        if (tagData && tagData.Created_By !== req.user.id && whoisUser.Type === "client") {
                                            //also we have to delete the candidate data and it's education data
                                            yield Education_1.default.destroy({
                                                where: { candidateId: educationData.candidateId }
                                            });
                                            yield Candidate_1.default.destroy({
                                                where: { id: educationData.candidateId }
                                            });
                                            importedCount--;
                                            updatedCount--;
                                            errors.push(`Tag "${tagName}" already exists and is not created by you.`);
                                            continue;
                                        }
                                        if (!tagData) {
                                            tagData = yield Tag_1.default.create({
                                                Tag_Name: tagName,
                                                Created_By: req.user.id
                                            });
                                        }
                                        yield CandidateTags_1.default.create({
                                            candidateId: educationData.candidateId,
                                            tagId: tagData.id,
                                        });
                                        console.log(`Tag "${tagName}" processed successfully.`);
                                    }
                                    catch (err) {
                                        console.error(`Error processing tag "${tagName}":`, err);
                                    }
                                }
                                else {
                                    console.warn('Empty tag encountered, skipping.');
                                }
                            }
                        }
                        else {
                            console.warn('Invalid Tags format: Expected a comma-separated string.');
                        }
                    }
                    catch (err) {
                        errors.push(`Failed to import candidate: ${data["Candidate Name"]}. Error: ${err.message}`);
                    }
                }
                // Delete the file after processing
                fs_1.default.unlinkSync(filePath);
                // Return the response with success and error details
                if (errors.length > 0) {
                    return res.status(http_status_codes_1.StatusCodes.PARTIAL_CONTENT).json({
                        message: `${importedCount} Candidate(s) Successfully Imported, but some failed.`,
                        success: true,
                        errors, // List of errors for failed candidates
                        importedCount, // Count of successful imports
                        failedCount: errors.length, // Count of failed imports
                        updatedCount, // Count of updated candidates
                    });
                }
                else {
                    return res.status(http_status_codes_1.StatusCodes.CREATED).json({
                        message: `${importedCount} Candidate(s) Successfully Imported`,
                        success: true,
                        errors: [], // No errors in the success case
                        importedCount, // Count of successfully imported candidates
                        updatedCount, // Count of updated candidates
                    });
                }
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
                "currentEmployeer",
                "State",
                "Country",
                "City",
                "Postal Address",
                "Preferred Location",
                "Date of Birth",
                "Designation",
                "UG",
                "PG",
                "Post PG",
                "Tags",
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
            // Add a sample row
            const sampleRow = {
                "Candidate Name": "Ayush Savner",
                "Resume Title": "Full Stack Developer",
                "Contact No": "7987785840",
                "Whatsapp No": "7927783840",
                "Email": "2ayushsavner@gmail.com",
                "Work Exp": "2 Y",
                "Current Annual Salary / CTC": "5 LPA",
                "Current Location": "Indore",
                "currentEmployeer": "",
                "State": "Madhya Pradesh",
                "Country": "India",
                "City": "Indore",
                "Postal Address": "Kanadia",
                "Preferred Location": "Pune",
                "Date of Birth": "2000-10-03",
                "Designation": "Software Engineer",
                "UG": "Btech Computer Science",
                "PG": "",
                "Post PG": "",
                "Tags": "Developer,Ui,Web Development",
            };
            csvStream.write(sampleRow);
            csvStream.end();
            writeStream.on("finish", () => {
                // Send the CSV file as a response
                res.download(filePath, "candidate-template.csv", (err) => {
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
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    })),
    fetchCandidateCtr1: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userExists = yield User_1.default.findOne({
                where: { id: req.user.id },
                attributes: { exclude: ["Password"] },
            });
            if (!userExists) {
                res.status(404);
                throw new Error("User Not Found Please Login !");
            }
            const _a = req.query, { page = 1, limit = 20 } = _a, filters = __rest(_a, ["page", "limit"]);
            const offset = (Number(page) - 1) * Number(limit);
            // Separate whereCondition for main table
            let whereCondition = {};
            // Basic candidate filters
            const candidateFields = [
                'name', 'email', 'contactNumber', 'whatsappNumber', 'resumeTitle',
                'workExp', 'currentCTC', 'currentLocation', 'state', 'preferredLocation',
                'dob', 'age', 'currentEmployeer', 'postalAddress', 'country', 'city', 'UserId'
            ];
            candidateFields.forEach(field => {
                if (filters[field]) {
                    whereCondition[field] = { [sequelize_1.Op.like]: `%${filters[field]}%` };
                }
            });
            const { workExpRange } = filters;
            if (workExpRange) {
                const [minExp, maxExp] = workExpRange.split('-').map(Number);
                if (!isNaN(minExp) && !isNaN(maxExp)) {
                    whereCondition.workExp = dbconfig_1.default.where(dbconfig_1.default.cast(dbconfig_1.default.fn('REPLACE', dbconfig_1.default.col('workExp'), ' Y', ''), 'UNSIGNED'), { [sequelize_1.Op.between]: [minExp, maxExp] });
                }
            }
            const { currentCTCRange } = filters;
            if (currentCTCRange) {
                const [minCTC, maxCTC] = currentCTCRange.split('-').map(Number);
                if (!isNaN(minCTC) && !isNaN(maxCTC)) {
                    whereCondition.currentCTC = dbconfig_1.default.where(dbconfig_1.default.cast(dbconfig_1.default.fn('REPLACE', dbconfig_1.default.col('currentCTC'), ' LPA', ''), 'UNSIGNED'), { [sequelize_1.Op.between]: [minCTC, maxCTC] });
                }
            }
            // Initialize include conditions
            let includeConditions = [];
            // Designation include with multi-search support
            const designationInclude = {
                model: Designation_1.default,
                as: "designation",
                attributes: ["id", "title"],
            };
            if (filters.designation && Array.isArray(filters.designation)) {
                designationInclude.where = {
                    id: { [sequelize_1.Op.in]: filters.designation.map((id) => parseInt(id)) }, // Parse as integers if they are IDs
                };
            }
            includeConditions.push(designationInclude);
            // Education include with filters
            const educationInclude = {
                model: Education_1.default,
                as: "education",
                attributes: ["ugCourse", "pgCourse", "postPgCourse"],
            };
            if (filters.ugCourse || filters.pgCourse || filters.postPgCourse) {
                educationInclude.where = {};
                if (filters.ugCourse) {
                    educationInclude.where.ugCourse = { [sequelize_1.Op.like]: `%${filters.ugCourse}%` };
                }
                if (filters.pgCourse) {
                    educationInclude.where.pgCourse = { [sequelize_1.Op.like]: `%${filters.pgCourse}%` };
                }
                if (filters.postPgCourse) {
                    educationInclude.where.postPgCourse = { [sequelize_1.Op.like]: `%${filters.postPgCourse}%` };
                }
            }
            includeConditions.push(educationInclude);
            // Tags include with multi-search support
            let tagInclude;
            if (userExists.Type === "client") {
                const clientId = yield Client_1.default.findOne({
                    where: { userId: req.user.id },
                });
                if (!clientId) {
                    res.status(http_status_codes_1.StatusCodes.NOT_FOUND);
                    throw new Error("Client Not Found");
                }
                const clientTags = yield ClientTags_1.default.findAll({
                    where: { ClientId: clientId.id },
                    attributes: ["tagId"],
                });
                if (!clientTags) {
                    res.status(http_status_codes_1.StatusCodes.NOT_FOUND);
                    throw new Error("Client Tags Not Found");
                }
                tagInclude = {
                    model: Tag_1.default,
                    as: "tags",
                    where: {
                        [sequelize_1.Op.or]: {
                            id: clientTags.map((tag) => tag.tagId),
                            Created_By: req.user.id,
                        },
                    },
                };
            }
            else if (userExists.Type === "superadmin") {
                tagInclude = {
                    model: Tag_1.default,
                    as: "tags",
                    attributes: ["id", "Tag_Name"],
                    through: { attributes: [] },
                };
            }
            if (filters.tags && Array.isArray(filters.tags)) {
                tagInclude.where = Object.assign(Object.assign({}, tagInclude.where), { id: { [sequelize_1.Op.in]: filters.tags.map((id) => parseInt(id)) } });
            }
            includeConditions.push(tagInclude);
            // Reasons include with multi-search support for reasons and reason answers
            const reasonsInclude = {
                model: ReasonSaveAnswer_1.default,
                as: "reasons",
                required: filters.reasons || filters.reasonAnswer ? true : false,
                where: filters.reasonAnswer ? {
                    answer: {
                        [sequelize_1.Op.in]: Array.isArray(filters.reasonAnswer) ?
                            filters.reasonAnswer.map((id) => parseInt(id)) : []
                    }
                } : undefined,
                include: [
                    {
                        model: ReasonForLeaving_1.default,
                        as: "reason",
                        attributes: ["reason", "id"],
                        required: filters.reasons ? true : false,
                        where: filters.reasons ? {
                            id: { [sequelize_1.Op.in]: Array.isArray(filters.reasons) ?
                                    filters.reasons.map((id) => parseInt(id)) : []
                            }
                        } : undefined
                    },
                    {
                        model: ReasonAnswer_1.default,
                        attributes: ["Reason_answer", "id"],
                    }
                ]
            };
            console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$", reasonsInclude);
            includeConditions.push(reasonsInclude);
            // First get the total count with a separate query
            const totalCount = yield Candidate_1.default.count({
                where: whereCondition,
                include: includeConditions,
                distinct: true,
            });
            // Then get the paginated results
            const fetchitems = yield Candidate_1.default.findAll({
                where: whereCondition,
                include: includeConditions,
                offset,
                limit: Number(limit),
                order: [['id', 'ASC']], // Add consistent ordering
            });
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "Fetch Candidate Successfully",
                success: true,
                result: fetchitems,
                totalCount,
                totalPages: Math.ceil(totalCount / Number(limit)),
                currentPage: Number(page),
            });
        }
        catch (error) {
            console.error(error);
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
        }
    }))
};
exports.default = CandidateCtr;
