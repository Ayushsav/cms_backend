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
const sequelize_1 = require("sequelize");
const dbconfig_1 = __importDefault(require("../../dbconfig/dbconfig"));
const ReasonSaveAnswer_1 = __importDefault(require("../../modals/ReasonSaveAnswer/ReasonSaveAnswer"));
const ReasonAnswer_1 = __importDefault(require("../../modals/ReasonAnswer/ReasonAnswer"));
const Candidate_1 = __importDefault(require("../../modals/Candidate/Candidate"));
const ClientTags_1 = __importDefault(require("../../modals/ClientTags"));
const Client_1 = __importDefault(require("../../modals/Client/Client"));
const User_1 = __importDefault(require("../../modals/User/User"));
const Tag_1 = __importDefault(require("../../modals/Tag/Tag"));
const answerCandidateController = {
    // Get distribution of answers/reasons across all candidates
    getAnswerDistribution: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield User_1.default.findOne({
                where: { id: req.user.id },
                attributes: ['id', 'Type'],
            });
            if (!user) {
                res.status(404).json({ success: false, message: 'User  not found' });
                return;
            }
            let distribution = [];
            if (user.Type === 'superadmin') {
                distribution = yield ReasonSaveAnswer_1.default.findAll({
                    attributes: [
                        'answer',
                        [dbconfig_1.default.fn('COUNT', dbconfig_1.default.col('candidateId')), 'candidateCount']
                    ],
                    include: [{
                            model: ReasonAnswer_1.default,
                            attributes: ['Reason_answer'],
                            required: true
                        }],
                    group: ['answer', 'ReasonAnswer.id', 'ReasonAnswer.Reason_answer'],
                    raw: true
                });
            }
            else if (user.Type === 'client') {
                const client = yield Client_1.default.findOne({ where: { userId: req.user.id } });
                if (!client) {
                    res.status(404).json({ success: false, message: "Client not found" });
                    return;
                }
                const clientTags = yield ClientTags_1.default.findAll({ where: { ClientId: client.id } });
                const tagIds = clientTags.map((tag) => tag.tagId);
                distribution = yield ReasonSaveAnswer_1.default.findAll({
                    attributes: [
                        'answer',
                        [dbconfig_1.default.fn('COUNT', dbconfig_1.default.col('ReasonSaveAnswer.candidateId')), 'candidateCount']
                    ],
                    include: [{
                            model: ReasonAnswer_1.default,
                            attributes: ['Reason_answer'],
                            required: true
                        },
                        {
                            model: Candidate_1.default,
                            as: 'candidate', // Specify the alias here
                            attributes: [],
                            required: true,
                            include: [{
                                    model: Tag_1.default,
                                    as: 'tags', // Specify the alias here
                                    attributes: [],
                                    required: true,
                                    through: { attributes: [] },
                                    where: {
                                        [sequelize_1.Op.or]: [
                                            { id: { [sequelize_1.Op.in]: tagIds } },
                                            { Created_By: req.user.id }
                                        ]
                                    }
                                }]
                        }],
                    group: ['answer', 'ReasonAnswer.id', 'ReasonAnswer.Reason_answer'],
                    raw: true
                });
            }
            // Sort by candidateCount in descending order
            const sortedDistribution = distribution.sort((a, b) => b.candidateCount - a.candidateCount).map(item => ({
                answer: item['ReasonAnswer.Reason_answer'],
                candidateCount: item.candidateCount
            }));
            // Use a Set to track unique answers
            const uniqueAnswers = new Set();
            const finalData = [];
            // Aggregate counts for unique answers
            sortedDistribution.forEach(item => {
                if (!uniqueAnswers.has(item.answer)) {
                    uniqueAnswers.add(item.answer);
                    finalData.push({ answer: item.answer, candidateCount: item.candidateCount });
                }
                else {
                    // If the answer is already in the finalData, aggregate the counts
                    const existing = finalData.find(data => data.answer === item.answer);
                    if (existing) {
                        existing.candidateCount += item.candidateCount;
                    }
                }
            });
            // Get the top 5 answers and the rest grouped into 'Other'
            const top5 = finalData.slice(0, 5);
            const other = finalData.slice(5);
            // Combine the "Other" data
            const otherData = other.reduce((acc, curr) => {
                acc.candidateCount += curr.candidateCount;
                return acc;
            }, { answer: 'Other', candidateCount: 0 });
            // Add the "Other" category to the top 5 answers if there are any
            if (otherData.candidateCount > 0) {
                top5.push(otherData);
            }
            // Respond with the final data
            res.json(top5);
        }
        catch (error) {
            res.status(500).json({ success: false, message: error === null || error === void 0 ? void 0 : error.message });
        }
    })),
    // Get most common answer combinations per candidate
    // getCommonAnswerCombinations: asyncHandler(async (req: Request, res: Response) => {
    //     const combinations = await sequelize.query(`
    //         SELECT 
    //             GROUP_CONCAT(ra.Reason_answer) as answer_combination,
    //             COUNT(DISTINCT rsa.candidateId) as candidate_count
    //         FROM ReasonSaveAnswer rsa
    //         JOIN ReasonAnswer ra ON rsa.answer = ra.id
    //         GROUP BY rsa.candidateId
    //         HAVING candidate_count > 1
    //         ORDER BY candidate_count DESC
    //         LIMIT 10
    //     `, {
    //         type: QueryTypes.SELECT
    //     });
    //     res.json(combinations);
    // }),
    // Get answers by candidate demographics (if applicable)
    getAnswersByDemographics: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield User_1.default.findOne({
                where: { id: req.user.id },
                attributes: ['id', 'Type'],
            });
            if (!user) {
                res.status(404).json({ success: false, message: 'User  not found' });
                return;
            }
            let demographics;
            if (user.Type === 'superadmin') {
                demographics = yield dbconfig_1.default.query(`
            SELECT 
                ra.Reason_answer,
                CASE 
                    WHEN TIMESTAMPDIFF(YEAR, c.dob, CURDATE()) < 25 THEN 'Under 25'
                    WHEN TIMESTAMPDIFF(YEAR, c.dob, CURDATE()) < 35 THEN '25-35'
                    WHEN TIMESTAMPDIFF(YEAR, c.dob, CURDATE()) < 45 THEN '35-45'
                    ELSE 'Over 45'
                END as age_group,
                COUNT(*) as count
            FROM ReasonSaveAnswer rsa
            JOIN ReasonAnswer ra ON rsa.answer = ra.id
            JOIN candidates c ON rsa.candidateId = c.id
            WHERE c.dob IS NOT NULL
            GROUP BY ra.Reason_answer, age_group
            ORDER BY ra.Reason_answer, age_group
        `, {
                    type: sequelize_1.QueryTypes.SELECT
                });
                res.json(demographics);
            }
            else if (user.Type === 'client') {
                const client = yield Client_1.default.findOne({ where: { userId: req.user.id } });
                if (!client) {
                    res.status(404).json({ success: false, message: "Client not found" });
                    return;
                }
                const clientTags = yield ClientTags_1.default.findAll({ where: { ClientId: client.id } });
                const tagIds = clientTags.map((tag) => tag.tagId);
                demographics = yield dbconfig_1.default.query(`
            SELECT 
                ra.Reason_answer,
                CASE 
                    WHEN TIMESTAMPDIFF(YEAR, c.dob, CURDATE()) < 25 THEN 'Under 25'
                    WHEN TIMESTAMPDIFF(YEAR, c.dob, CURDATE()) < 35 THEN '25-35'
                    WHEN TIMESTAMPDIFF(YEAR, c.dob, CURDATE()) < 45 THEN '35-45'
                    ELSE 'Over 45'
                END as age_group,
                COUNT(*) as count
            FROM ReasonSaveAnswer rsa
            JOIN ReasonAnswer ra ON rsa.answer = ra.id
            JOIN candidates c ON rsa.candidateId = c.id
            LEFT JOIN candidate_tags ct ON c.id = ct.candidateId
            LEFT JOIN Tag t ON ct.tagId = t.id
            WHERE c.dob IS NOT NULL AND (ct.tagId IN (:tagIds) OR t.Created_By = :userId)
            GROUP BY ra.Reason_answer, age_group
            ORDER BY ra.Reason_answer, age_group
        `, {
                    type: sequelize_1.QueryTypes.SELECT,
                    replacements: { tagIds, userId: req.user.id }
                });
                res.json(demographics);
            }
        }
        catch (error) {
            res.status(500).json({ success: false, message: error === null || error === void 0 ? void 0 : error.message });
        }
    })),
    // Get answer trends over time with candidate counts
    // getAnswerTrends: asyncHandler(async (req: Request, res: Response) => {
    //     const { startDate, endDate } = req.query;
    //     const whereClause: WhereOptions<any> = {
    //         createdAt: {
    //             [Op.between]: [
    //                 startDate || '2000-01-01',
    //                 endDate || new Date()
    //             ]
    //         }
    //     };
    //     const trends = await ReasonSaveAnswer.findAll({
    //         attributes: [
    //             [sequelize.fn('DATE_FORMAT', sequelize.col('ReasonSaveAnswer.createdAt'), '%Y-%m'), 'month'],
    //             'answer',
    //             [sequelize.fn('COUNT', sequelize.col('candidateId')), 'candidate_count']
    //         ],
    //         where: whereClause,
    //         include: [{
    //             model: ReasonAnswer,
    //             attributes: ['Reason_answer'],
    //             required: true
    //         }],
    //         group: [
    //             sequelize.fn('DATE_FORMAT', sequelize.col('ReasonSaveAnswer.createdAt'), '%Y-%m'),
    //             'answer',
    //             'ReasonAnswer.id',
    //             'ReasonAnswer.Reason_answer'
    //         ],
    //         order: [[sequelize.fn('DATE_FORMAT', sequelize.col('ReasonSaveAnswer.createdAt'), '%Y-%m'), 'ASC']],
    //         raw: true
    //     });
    //     res.json(trends);
    // }),
    // Get candidate statistics per answer
    getCandidateStatsPerAnswer: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield User_1.default.findOne({
                where: { id: req.user.id },
                attributes: ['id', 'Type'],
            });
            if (!user) {
                res.status(404).json({ success: false, message: 'User  not found' });
                return;
            }
            let stats;
            if (user.Type === 'superadmin') {
                stats = yield ReasonAnswer_1.default.findAll({
                    attributes: [
                        'id',
                        'Reason_answer',
                        [dbconfig_1.default.fn('COUNT', dbconfig_1.default.col('ReasonSaveAnswers.candidateId')), 'total_candidates'],
                        [
                            dbconfig_1.default.fn('COUNT', dbconfig_1.default.fn('DISTINCT', dbconfig_1.default.col('ReasonSaveAnswers.candidateId'))),
                            'unique_candidates'
                        ]
                    ],
                    include: [{
                            model: ReasonSaveAnswer_1.default,
                            attributes: [],
                            required: false
                        }],
                    group: ['ReasonAnswer.id', 'ReasonAnswer.Reason_answer'],
                    raw: true
                });
                res.json(stats);
            }
            else if (user.Type === 'client') {
                const client = yield Client_1.default.findOne({ where: { userId: req.user.id } });
                if (!client) {
                    res.status(404).json({ success: false, message: "Client not found" });
                    return;
                }
                const clientTags = yield ClientTags_1.default.findAll({ where: { ClientId: client.id } });
                const tagIds = clientTags.map((tag) => tag.tagId);
                stats = yield ReasonAnswer_1.default.findAll({
                    attributes: [
                        'id',
                        'Reason_answer',
                        [dbconfig_1.default.fn('COUNT', dbconfig_1.default.col('ReasonSaveAnswers.candidateId')), 'total_candidates'],
                        [
                            dbconfig_1.default.fn('COUNT', dbconfig_1.default.fn('DISTINCT', dbconfig_1.default.col('ReasonSaveAnswers.candidateId'))),
                            'unique_candidates'
                        ]
                    ],
                    include: [{
                            model: ReasonSaveAnswer_1.default,
                            as: 'ReasonSaveAnswers', // Specify the alias here
                            attributes: [],
                            required: false,
                            include: [{
                                    model: Candidate_1.default,
                                    as: 'candidate', // Specify the alias here
                                    attributes: [],
                                    required: true,
                                    include: [{
                                            model: Tag_1.default,
                                            as: 'tags', // Specify the alias here
                                            attributes: [],
                                            required: true,
                                            through: { attributes: [] },
                                            where: {
                                                [sequelize_1.Op.or]: [
                                                    { id: { [sequelize_1.Op.in]: tagIds } },
                                                    { Created_By: req.user.id }
                                                ]
                                            }
                                        }]
                                }]
                        }],
                    group: ['ReasonAnswer.id', 'ReasonAnswer.Reason_answer'],
                    raw: true
                });
                res.json(stats);
            }
        }
        catch (error) {
            res.status(500).json({ success: false, message: error === null || error === void 0 ? void 0 : error.message });
        }
    })),
    // Get answers by candidate experience level
    getAnswersByExperience: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield User_1.default.findOne({
                where: { id: req.user.id },
                attributes: ['id', 'Type'],
            });
            if (!user) {
                res.status(404).json({ success: false, message: 'User  not found' });
                return;
            }
            let experienceDistribution;
            if (user.Type === 'superadmin') {
                experienceDistribution = yield dbconfig_1.default.query(`
            SELECT 
                ra.Reason_answer,
                CASE 
                    WHEN c.workExp < 2 THEN 'Junior'
                    WHEN c.workExp < 5 THEN 'Mid-level'
                    ELSE 'Senior'
                END as experience_level,
                COUNT(*) as count
            FROM ReasonSaveAnswer rsa
            JOIN ReasonAnswer ra ON rsa.answer = ra.id
            JOIN candidates c ON rsa.candidateId = c.id
            GROUP BY ra.Reason_answer, experience_level
            ORDER BY ra.Reason_answer, experience_level
        `, {
                    type: sequelize_1.QueryTypes.SELECT
                });
                res.json(experienceDistribution);
            }
            else if (user.Type === 'client') {
                const client = yield Client_1.default.findOne({ where: { userId: req.user.id } });
                if (!client) {
                    res.status(404).json({ success: false, message: "Client not found" });
                    return;
                }
                const clientTags = yield ClientTags_1.default.findAll({ where: { ClientId: client.id } });
                const tagIds = clientTags.map((tag) => tag.tagId);
                experienceDistribution = yield dbconfig_1.default.query(`
            SELECT 
                ra.Reason_answer,
                CASE 
                    WHEN c.workExp < 2 THEN 'Junior'
                    WHEN c.workExp < 5 THEN 'Mid-level'
                    ELSE 'Senior'
                END as experience_level,
                COUNT(*) as count
            FROM ReasonSaveAnswer rsa
            JOIN ReasonAnswer ra ON rsa.answer = ra.id
            JOIN candidates c ON rsa.candidateId = c.id
            LEFT JOIN candidate_tags ct ON c.id = ct.candidateId
            LEFT JOIN Tag t ON ct.tagId = t.id
            WHERE ct.tagId IN (:tagIds) OR t.Created_By = :userId
            GROUP BY ra.Reason_answer, experience_level
            ORDER BY ra.Reason_answer, experience_level
        `, {
                    type: sequelize_1.QueryTypes.SELECT,
                    replacements: { tagIds, userId: req.user.id }
                });
                res.json(experienceDistribution);
            }
        }
        catch (error) {
            res.status(500).json({ success: false, message: error === null || error === void 0 ? void 0 : error.message });
        }
    }))
};
exports.default = answerCandidateController;
