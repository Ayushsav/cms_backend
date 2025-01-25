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
const Candidate_1 = __importDefault(require("../../modals/Candidate/Candidate"));
const Client_1 = __importDefault(require("../../modals/Client/Client"));
const Tag_1 = __importDefault(require("../../modals/Tag/Tag"));
const Designation_1 = __importDefault(require("../../modals/Designation/Designation"));
const ClientTags_1 = __importDefault(require("../../modals/ClientTags"));
const dbconfig_1 = __importDefault(require("../../dbconfig/dbconfig")); // Adjust the path to your database configuration file
const sequelize_1 = require("sequelize");
const DashboardCtr = {
    dashboardData: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield User_1.default.findOne({
                where: { id: req.user.id },
                attributes: ["id", "Type"],
            });
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }
            if (user.Type === "superadmin") {
                const [candidates, clients, tags, designations] = yield Promise.all([
                    Candidate_1.default.count(),
                    Client_1.default.count({ where: { Status: "Active" } }),
                    Tag_1.default.count(),
                    Designation_1.default.count(),
                ]);
                //find recent 5 candidates with attributes name location experience designation
                const recentCandidates = yield Candidate_1.default.findAll({
                    limit: 5,
                    order: [["createdAt", "DESC"]],
                    attributes: ["id", "name", "city", "workExp", "designationId"],
                    include: [
                        {
                            model: Designation_1.default,
                            as: "designation",
                            attributes: ["title"],
                        },
                    ],
                });
                return res.status(200).json({
                    success: true,
                    data: { candidates, clients, tags, designations, recentCandidates },
                });
            }
            if (user.Type === "client") {
                const client = yield Client_1.default.findOne({ where: { userId: req.user.id } });
                if (!client) {
                    return res.status(404).json({ success: false, message: "Client not found" });
                }
                const clientTags = yield ClientTags_1.default.findAll({ where: { ClientId: client.id } });
                const tagIds = clientTags.map((tag) => tag.tagId);
                const candidates = yield Candidate_1.default.count({
                    distinct: true, // Ensures each candidate is counted only once
                    col: 'id', // Specify the column to check for distinct values
                    include: [{
                            model: Tag_1.default,
                            as: "tags",
                            where: {
                                [sequelize_1.Op.or]: {
                                    id: tagIds,
                                    Created_By: req.user.id,
                                },
                            },
                        }],
                });
                //count tags created by client
                const createdtags = yield Tag_1.default.findAll({ where: { Created_By: req.user.id } });
                //count created candidates by client by using tag
                const createdCandidates = yield Candidate_1.default.count({
                    include: [{
                            model: Tag_1.default,
                            as: "tags",
                            where: {
                                [sequelize_1.Op.and]: {
                                    id: createdtags.map((tag) => tag.id),
                                    Created_By: req.user.id,
                                },
                            },
                        }],
                });
                return res.status(200).json({
                    success: true,
                    data: { candidates, createdtags: createdtags.length, createdCandidates, tags: tagIds.length },
                });
            }
            res.status(400).json({ success: false, message: "Invalid user type" });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    })),
    dashboardData1: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield User_1.default.findOne({
                where: { id: req.user.id },
                attributes: ["id", "Type"],
            });
            if (!user) {
                return res.status(404).json({ success: false, message: "User  not found" });
            }
            if (user.Type === "superadmin") {
                // Fetch the top 5 tags with the number of candidates associated with them
                const tagCounts = yield dbconfig_1.default.query(`

          SELECT t.id, t.Tag_Name, COUNT(ct.candidateId) AS candidateCount

          FROM Tag t

          LEFT JOIN candidate_tags ct ON t.id = ct.tagId

          GROUP BY t.id

          ORDER BY candidateCount DESC

          LIMIT 5

        `, {
                    type: sequelize_1.QueryTypes.SELECT,
                });
                // Fetch the top 5 tags with the number of clients associated with them
                const clientTagCounts = yield dbconfig_1.default.query(`

          SELECT t.id, t.Tag_Name, COUNT(ct.ClientId) AS clientCount

          FROM Tag t

          LEFT JOIN Client_tags ct ON t.id = ct.tagId

          GROUP BY t.id

          ORDER BY clientCount DESC

          LIMIT 5

        `, {
                    type: sequelize_1.QueryTypes.SELECT,
                });
                return res.status(200).json({
                    success: true,
                    data: {
                        candidateTags: tagCounts.map((tag) => ({
                            id: tag.id,
                            name: tag.Tag_Name,
                            candidateCount: tag.candidateCount,
                        })),
                        clientTags: clientTagCounts.map((tag) => ({
                            id: tag.id,
                            name: tag.Tag_Name,
                            clientCount: tag.clientCount,
                        })),
                    },
                });
            }
            if (user.Type === "client") {
                // Fetch the client's associated tags
                const client = yield Client_1.default.findOne({ where: { userId: req.user.id } });
                if (!client) {
                    return res.status(404).json({ success: false, message: "Client not found" });
                }
                // Fetch the top 5 tags associated with the client's candidates
                const tagCounts = yield dbconfig_1.default.query(`

          SELECT t.id, t.Tag_Name, COUNT(ct.candidateId) AS candidateCount

          FROM Tag t

          LEFT JOIN candidate_tags ct ON t.id = ct.tagId

          LEFT JOIN candidates c ON ct.candidateId = c.id

          WHERE c.UserId = :userId

          GROUP BY t.id

          ORDER BY candidateCount DESC

          LIMIT 5

        `, {
                    replacements: { userId: client.userId },
                    type: sequelize_1.QueryTypes.SELECT,
                });
                // Fetch the top 5 tags associated with the client
                const clientTagCounts = yield dbconfig_1.default.query(`
          SELECT t.id, t.Tag_Name, COUNT(DISTINCT ct.candidateId) AS candidateCount
          FROM Tag t
          LEFT JOIN Client_tags ctg ON t.id = ctg.tagId
          LEFT JOIN candidate_tags ct ON t.id = ct.tagId
          WHERE ctg.ClientId = :clientId
          GROUP BY t.id
          ORDER BY candidateCount DESC
          LIMIT 5
        `, {
                    replacements: { clientId: client.id },
                    type: sequelize_1.QueryTypes.SELECT,
                });
                return res.status(200).json({
                    success: true,
                    data: {
                        candidateTags: tagCounts.map((tag) => ({
                            id: tag.id,
                            name: tag.Tag_Name,
                            candidateCount: tag.candidateCount,
                        })),
                        clientTags: clientTagCounts.map((tag) => ({
                            id: tag.id,
                            name: tag.Tag_Name,
                            clientCount: tag.candidateCount,
                        })),
                    },
                });
            }
            res.status(400).json({ success: false, message: "Invalid user type" });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    })),
};
exports.default = DashboardCtr;
