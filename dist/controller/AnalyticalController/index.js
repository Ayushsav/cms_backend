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
const Candidate_1 = __importDefault(require("../../modals/Candidate/Candidate"));
const Designation_1 = __importDefault(require("../../modals/Designation/Designation"));
const Education_1 = __importDefault(require("../../modals/Eduction/Education"));
const dbconfig_1 = __importDefault(require("../../dbconfig/dbconfig"));
const Tag_1 = __importDefault(require("../../modals/Tag/Tag"));
const Client_1 = __importDefault(require("../../modals/Client/Client"));
const sequelize_1 = require("sequelize");
const ClientTags_1 = __importDefault(require("../../modals/ClientTags"));
const User_1 = __importDefault(require("../../modals/User/User"));
const sequelize_2 = require("sequelize");
const AnalyticalCtr = {
    // Candidate Distribution by Designation
    candidateDistribution: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield User_1.default.findOne({
                where: { id: req.user.id },
                attributes: ['id', 'Type'],
            });
            if (!user) {
                res.status(404).json({ success: false, message: 'User  not found' });
                return;
            }
            let distribution;
            if (user.Type === 'superadmin') {
                distribution = (yield Candidate_1.default.findAll({
                    attributes: [
                        'designationId',
                        [dbconfig_1.default.fn('COUNT', dbconfig_1.default.col('Candidate.id')), 'count'], // Explicitly qualify 'id' with the table/alias
                    ],
                    group: ['designationId'],
                    include: [
                        {
                            model: Designation_1.default,
                            as: 'designation',
                            attributes: ['title'],
                        },
                    ],
                    order: [[dbconfig_1.default.literal('count'), 'DESC']], // Order by count in descending order
                    limit: 10, // Limit to top 10 results
                }));
                res.status(200).json({
                    success: true,
                    data: distribution,
                });
            }
            else {
                const client = yield Client_1.default.findOne({ where: { userId: req.user.id } });
                if (!client) {
                    res.status(404).json({ success: false, message: "Client not found" });
                    return;
                }
                const clientTags = yield ClientTags_1.default.findAll({ where: { ClientId: client.id } });
                const tagIds = clientTags.map((tag) => tag.tagId);
                distribution = (yield Candidate_1.default.findAll({
                    attributes: [
                        'designationId',
                        [dbconfig_1.default.fn('COUNT', dbconfig_1.default.col('Candidate.id')), 'count'], // Explicitly qualify 'id' with the table/alias
                    ],
                    group: ['designationId'],
                    include: [
                        {
                            model: Designation_1.default,
                            as: 'designation',
                            attributes: ['title'],
                        },
                        {
                            model: Tag_1.default,
                            as: "tags",
                            attributes: [],
                            where: {
                                [sequelize_1.Op.or]: {
                                    id: tagIds,
                                    Created_By: req.user.id,
                                },
                            },
                        },
                    ],
                    order: [[dbconfig_1.default.literal('count'), 'DESC']], // Order by count in descending order
                    limit: 10, // Limit to top 10 results
                }));
                res.status(200).json({
                    success: true,
                    data: distribution,
                });
            }
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    })),
    // Work Experience Analysis
    workExperienceAnalysis: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                experienceDistribution = yield Candidate_1.default.findAll({
                    attributes: [
                        [dbconfig_1.default.fn('SUM', dbconfig_1.default.literal("CASE WHEN workExp BETWEEN 0 AND 1 THEN 1 ELSE 0 END")), '0-1 years'],
                        [dbconfig_1.default.fn('SUM', dbconfig_1.default.literal("CASE WHEN workExp BETWEEN 1 AND 3 THEN 1 ELSE 0 END")), '1-3 years'],
                        [dbconfig_1.default.fn('SUM', dbconfig_1.default.literal("CASE WHEN workExp BETWEEN 3 AND 5 THEN 1 ELSE 0 END")), '3-5 years'],
                        [dbconfig_1.default.fn('SUM', dbconfig_1.default.literal("CASE WHEN workExp BETWEEN 5 AND 10 THEN 1 ELSE 0 END")), '5-10 years'],
                        [dbconfig_1.default.fn('SUM', dbconfig_1.default.literal("CASE WHEN workExp BETWEEN 10 AND 20 THEN 1 ELSE 0 END")), '10-20 years'],
                    ],
                    raw: true // This will return the result as a plain object
                });
            }
            else {
                const client = yield Client_1.default.findOne({ where: { userId: req.user.id } });
                if (!client) {
                    res.status(404).json({ success: false, message: "Client not found" });
                    return;
                }
                const clientTags = yield ClientTags_1.default.findAll({ where: { ClientId: client.id } });
                const tagIds = clientTags.map((tag) => tag.tagId);
                experienceDistribution = yield Candidate_1.default.findAll({
                    attributes: [
                        [dbconfig_1.default.fn('SUM', dbconfig_1.default.literal("CASE WHEN workExp BETWEEN 0 AND 1 THEN 1 ELSE 0 END")), '0-1 years'],
                        [dbconfig_1.default.fn('SUM', dbconfig_1.default.literal("CASE WHEN workExp BETWEEN 1 AND 3 THEN 1 ELSE 0 END")), '1-3 years'],
                        [dbconfig_1.default.fn('SUM', dbconfig_1.default.literal("CASE WHEN workExp BETWEEN 3 AND 5 THEN 1 ELSE 0 END")), '3-5 years'],
                        [dbconfig_1.default.fn('SUM', dbconfig_1.default.literal("CASE WHEN workExp BETWEEN 5 AND 10 THEN 1 ELSE 0 END")), '5-10 years'],
                        [dbconfig_1.default.fn('SUM', dbconfig_1.default.literal("CASE WHEN workExp BETWEEN 10 AND 20 THEN 1 ELSE 0 END")), '10-20 years']
                    ],
                    // where: {
                    //     [Op.or]: {
                    //         '$tags.id$': tagIds, // Ensure candidates are filtered by the client's tags
                    //     },
                    // },
                    include: [{
                            model: Tag_1.default,
                            as: "tags",
                            required: true, // Ensure that only candidates with tags are included
                            where: {
                                [sequelize_1.Op.or]: {
                                    id: tagIds,
                                    Created_By: req.user.id,
                                },
                            },
                        }],
                    raw: true // This will return the result as a plain object
                });
            }
            // Transform the result into the desired format
            const formattedResponse = [
                { experience_range: "0-1 years", count: experienceDistribution[0]['0-1 years'] || 0 },
                { experience_range: "1-3 years", count: experienceDistribution[0]['1-3 years'] || 0 },
                { experience_range: "3-5 years", count: experienceDistribution[0]['3-5 years'] || 0 },
                { experience_range: "5-10 years", count: experienceDistribution[0]['5-10 years'] || 0 },
                { experience_range: "10-20 years", count: experienceDistribution[0]['10-20 years'] || 0 },
            ];
            return res.json({ success: true, data: formattedResponse });
        }
        catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    })),
    // Current CTC Analysis
    currentCTCAnalysis: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield User_1.default.findOne({
                where: { id: req.user.id },
                attributes: ['id', 'Type'],
            });
            if (!user) {
                res.status(404).json({ success: false, message: 'User  not found' });
                return;
            }
            let ctcDistribution;
            if (user.Type === 'superadmin') {
                ctcDistribution = yield Candidate_1.default.findAll({
                    attributes: [
                        [
                            dbconfig_1.default.fn('MIN', dbconfig_1.default.cast(dbconfig_1.default.fn('REPLACE', dbconfig_1.default.col('currentCTC'), 'LPA', ''), 'UNSIGNED')),
                            'minCTC',
                        ],
                        [
                            dbconfig_1.default.fn('MAX', dbconfig_1.default.cast(dbconfig_1.default.fn('REPLACE', dbconfig_1.default.col('currentCTC'), 'LPA', ''), 'UNSIGNED')),
                            'maxCTC',
                        ],
                        [
                            dbconfig_1.default.fn('ROUND', dbconfig_1.default.fn('AVG', dbconfig_1.default.cast(dbconfig_1.default.fn('REPLACE', dbconfig_1.default.col('currentCTC'), 'LPA', ''), 'UNSIGNED')), 2),
                            'avgCTC',
                        ],
                    ],
                    where: {
                        currentCTC: {
                            [sequelize_1.Op.not]: '',
                            [sequelize_1.Op.ne]: '',
                            [sequelize_1.Op.notLike]: '%null%'
                        }
                    }
                });
                res.status(200).json({
                    success: true,
                    data: ctcDistribution,
                });
            }
            else {
                const client = yield Client_1.default.findOne({ where: { userId: req.user.id } });
                if (!client) {
                    res.status(404).json({ success: false, message: "Client not found" });
                    return;
                }
                const clientTags = yield ClientTags_1.default.findAll({ where: { ClientId: client.id } });
                const tagIds = clientTags.map((tag) => tag.tagId);
                ctcDistribution = yield Candidate_1.default.findAll({
                    include: [{
                            model: Tag_1.default,
                            as: "tags",
                            attributes: [],
                            where: {
                                [sequelize_1.Op.or]: {
                                    id: tagIds,
                                    Created_By: req.user.id,
                                },
                            },
                        }],
                    attributes: [
                        [
                            dbconfig_1.default.fn('MIN', dbconfig_1.default.cast(dbconfig_1.default.fn('REPLACE', dbconfig_1.default.col('currentCTC'), 'LPA', ''), 'UNSIGNED')),
                            'minCTC',
                        ],
                        [
                            dbconfig_1.default.fn('MAX', dbconfig_1.default.cast(dbconfig_1.default.fn('REPLACE', dbconfig_1.default.col('currentCTC'), 'LPA', ''), 'UNSIGNED')),
                            'maxCTC',
                        ],
                        [
                            dbconfig_1.default.fn('ROUND', dbconfig_1.default.fn('AVG', dbconfig_1.default.cast(dbconfig_1.default.fn('REPLACE', dbconfig_1.default.col('currentCTC'), 'LPA', ''), 'UNSIGNED')), 2),
                            'avgCTC',
                        ],
                    ],
                    where: {
                        currentCTC: {
                            [sequelize_1.Op.not]: '',
                            [sequelize_1.Op.ne]: '',
                            [sequelize_1.Op.notLike]: '%null%',
                        },
                    }
                });
                res.status(200).json({
                    success: true,
                    data: ctcDistribution,
                });
            }
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
            return;
        }
    })),
    geographicalDistribution: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield User_1.default.findOne({
                where: { id: req.user.id },
                attributes: ['id', 'Type'],
            });
            if (!user) {
                return res.status(404).json({ success: false, message: 'User  not found' });
            }
            let geoDistribution;
            if (user.Type === 'superadmin') {
                geoDistribution = yield Candidate_1.default.findAll({
                    attributes: ['state', [dbconfig_1.default.fn('COUNT', dbconfig_1.default.col('Candidate.id')), 'count']], // Specify the table name
                    group: ['state'],
                });
            }
            else {
                const client = yield Client_1.default.findOne({ where: { userId: req.user.id } });
                if (!client) {
                    return res.status(404).json({ success: false, message: "Client not found" });
                }
                const clientTags = yield ClientTags_1.default.findAll({ where: { ClientId: client.id } });
                const tagIds = clientTags.map((tag) => tag.tagId);
                geoDistribution = yield Candidate_1.default.findAll({
                    attributes: ['state', [dbconfig_1.default.fn('COUNT', dbconfig_1.default.col('Candidate.id')), 'count']], // Specify the table name
                    group: ['state'],
                    include: [{
                            model: Tag_1.default,
                            as: "tags",
                            attributes: [],
                            where: {
                                [sequelize_1.Op.or]: {
                                    id: tagIds,
                                    Created_By: req.user.id,
                                },
                            },
                        }],
                });
            }
            res.status(200).json({ success: true, data: geoDistribution });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    })),
    // Education Level Analysis
    educationLevelAnalysis: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield User_1.default.findOne({
                where: { id: req.user.id },
                attributes: ['id', 'Type'],
            });
            if (!user) {
                res.status(404).json({ success: false, message: 'User  not found' });
                return;
            }
            let educationDistribution;
            if (user.Type === 'superadmin') {
                educationDistribution = yield Candidate_1.default.findAll({
                    include: [
                        {
                            model: Education_1.default,
                            as: 'education',
                            attributes: [],
                        },
                    ],
                    attributes: [
                        [dbconfig_1.default.fn('COUNT', dbconfig_1.default.col('education.ugCourse')), 'ugCount'],
                        [dbconfig_1.default.fn('COUNT', dbconfig_1.default.col('education.pgCourse')), 'pgCount'],
                        [dbconfig_1.default.fn('COUNT', dbconfig_1.default.col('education.postPgCourse')), 'postPgCount'],
                    ],
                });
                res.json(educationDistribution);
            }
            else {
                const client = yield Client_1.default.findOne({ where: { userId: req.user.id } });
                if (!client) {
                    res.status(404).json({ success: false, message: "Client not found" });
                    return;
                }
                const clientTags = yield ClientTags_1.default.findAll({ where: { ClientId: client.id } });
                const tagIds = clientTags.map((tag) => tag.tagId);
                educationDistribution = yield Candidate_1.default.findAll({
                    include: [
                        {
                            model: Education_1.default,
                            as: 'education',
                            attributes: [],
                        },
                        {
                            model: Tag_1.default,
                            as: "tags",
                            attributes: [],
                            where: {
                                [sequelize_1.Op.or]: {
                                    id: tagIds,
                                    Created_By: req.user.id,
                                },
                            },
                        }
                    ],
                    attributes: [
                        [dbconfig_1.default.fn('COUNT', dbconfig_1.default.col('education.ugCourse')), 'ugCount'],
                        [dbconfig_1.default.fn('COUNT', dbconfig_1.default.col('education.pgCourse')), 'pgCount'],
                        [dbconfig_1.default.fn('COUNT', dbconfig_1.default.col('education.postPgCourse')), 'postPgCount'],
                    ],
                });
                res.json(educationDistribution);
            }
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    })),
    // Client Status Analysis (Assuming you have a Client model)
    clientStatusAnalysis: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // This is a placeholder. You need to implement the Client model and its relationships.
        const clientStatus = yield Client_1.default.findAll({
            attributes: ['status', [dbconfig_1.default.fn('COUNT', dbconfig_1.default.col('id')), 'count']],
            group: ['status'],
        });
        res.json(clientStatus);
    })),
    // Tag Analysis for Candidates
    tagAnalysis: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield User_1.default.findOne({
                where: { id: req.user.id },
                attributes: ['id', 'Type'],
            });
            if (!user) {
                res.status(404).json({ success: false, message: 'User  not found' });
                return;
            }
            let tagDistribution;
            let topTags = [];
            if (user.Type === 'superadmin') {
                tagDistribution = yield dbconfig_1.default.query(`
      SELECT t.Tag_Name as tag, COUNT(ct.tagId) as count
      FROM Tag t
      INNER JOIN candidate_tags ct ON t.id = ct.tagId
      GROUP BY t.id, t.Tag_Name
    `, {
                    type: sequelize_2.QueryTypes.SELECT,
                    raw: true
                });
                // Sort tags by count in descending order
                tagDistribution.sort((a, b) => b.count - a.count);
                // Get top 5 tags
                topTags = tagDistribution.slice(0, 5);
                // Group remaining tags under "Other"
                // const otherTagsCount = tagDistribution.slice(5).reduce((acc: number, tag: any) => acc + tag.count, 0);
                // if (otherTagsCount > 0) {
                //     topTags.push({ tag: 'Other', count: otherTagsCount });
                // }
            }
            else if (user.Type === 'client') {
                const client = yield Client_1.default.findOne({ where: { userId: req.user.id } });
                if (!client) {
                    res.status(404).json({ success: false, message: "Client not found" });
                    return;
                }
                const clientTags = yield ClientTags_1.default.findAll({ where: { ClientId: client.id } });
                const tagIds = clientTags.map((tag) => tag.tagId);
                //now we need to filter using tagIds and Created_By
                tagDistribution = yield dbconfig_1.default.query(`
      SELECT t.Tag_Name as tag, COUNT(ct.tagId) as count
      FROM Tag t
      INNER JOIN candidate_tags ct ON t.id = ct.tagId
      WHERE ct.tagId IN (${tagIds.join(',')}) OR t.Created_By = ${req.user.id}
      GROUP BY t.id, t.Tag_Name
    `, {
                    type: sequelize_2.QueryTypes.SELECT,
                    raw: true
                });
                // Sort tags by count in descending order
                tagDistribution.sort((a, b) => b.count - a.count);
                // Get top 5 tags
                topTags = tagDistribution.slice(0, 5);
                // const otherTagsCount = tagDistribution.slice(5).reduce((acc: number, tag: any) => acc + tag.count, 0);
                // if (otherTagsCount > 0) {
                //     topTags.push({ tag: 'Other', count: otherTagsCount });
                // }
            }
            res.json(topTags);
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    })),
    // Candidate Age Distribution
    candidateAgeDistribution: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield User_1.default.findOne({
                where: { id: req.user.id },
                attributes: ['id', 'Type'],
            });
            if (!user) {
                res.status(404).json({ success: false, message: 'User  not found' });
                return;
            }
            let ageDistribution;
            const currentYear = new Date().getFullYear();
            if (user.Type === 'superadmin') {
                ageDistribution = yield Candidate_1.default.findAll({
                    attributes: [
                        [dbconfig_1.default.fn('SUM', dbconfig_1.default.literal(`CASE WHEN YEAR(dob) BETWEEN ${currentYear - 25} AND ${currentYear - 20} THEN 1 ELSE 0 END`)), '20-25'],
                        [dbconfig_1.default.fn('SUM', dbconfig_1.default.literal(`CASE WHEN YEAR(dob) BETWEEN ${currentYear - 30} AND ${currentYear - 26} THEN 1 ELSE 0 END`)), '26-30'],
                        [dbconfig_1.default.fn('SUM', dbconfig_1.default.literal(`CASE WHEN YEAR(dob) BETWEEN ${currentYear - 35} AND ${currentYear - 31} THEN 1 ELSE 0 END`)), '31-35'],
                        [dbconfig_1.default.fn('SUM', dbconfig_1.default.literal(`CASE WHEN YEAR(dob) < ${currentYear - 35} THEN 1 ELSE 0 END`)), '35+'],
                    ],
                });
                res.json(ageDistribution);
            }
            else {
                const client = yield Client_1.default.findOne({ where: { userId: req.user.id } });
                if (!client) {
                    res.status(404).json({ success: false, message: "Client not found" });
                    return;
                }
                const clientTags = yield ClientTags_1.default.findAll({ where: { ClientId: client.id } });
                const tagIds = clientTags.map((tag) => tag.tagId);
                ageDistribution = yield Candidate_1.default.findAll({
                    attributes: [
                        [dbconfig_1.default.fn('SUM', dbconfig_1.default.literal(`CASE WHEN YEAR(dob) BETWEEN ${currentYear - 25} AND ${currentYear - 20} THEN 1 ELSE 0 END`)), '20-25'],
                        [dbconfig_1.default.fn('SUM', dbconfig_1.default.literal(`CASE WHEN YEAR(dob) BETWEEN ${currentYear - 30} AND ${currentYear - 26} THEN 1 ELSE 0 END`)), '26-30'],
                        [dbconfig_1.default.fn('SUM', dbconfig_1.default.literal(`CASE WHEN YEAR(dob) BETWEEN ${currentYear - 35} AND ${currentYear - 31} THEN 1 ELSE 0 END`)), '31-35'],
                        [dbconfig_1.default.fn('SUM', dbconfig_1.default.literal(`CASE WHEN YEAR(dob) < ${currentYear - 35} THEN 1 ELSE 0 END`)), '35+'],
                    ],
                    include: [{
                            model: Tag_1.default,
                            as: "tags",
                            attributes: [],
                            where: {
                                [sequelize_1.Op.or]: {
                                    id: tagIds,
                                    Created_By: req.user.id,
                                },
                            },
                        }],
                });
                res.json(ageDistribution);
            }
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    })),
};
exports.default = AnalyticalCtr;
