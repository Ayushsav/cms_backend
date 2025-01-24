import asyncHandler from "express-async-handler";
import { Response } from "express";
import User from "../../modals/User/User";
import { CustomRequest } from "../../typeReq/customReq";
import Candidate from "../../modals/Candidate/Candidate";
import Client from "../../modals/Client/Client";
import Tag from "../../modals/Tag/Tag";
import Designation from "../../modals/Designation/Designation";
import ClientTags from "../../modals/ClientTags";
import sequelize from "../../dbconfig/dbconfig"; // Adjust the path to your database configuration file
import { Op, QueryTypes } from "sequelize";

const DashboardCtr = {
  dashboardData: asyncHandler(async (req: CustomRequest, res: Response): Promise<any> => {
    try {
      const user = await User.findOne({
        where: { id: req.user.id },
        attributes: ["id", "Type"],
      });

      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      if (user.Type === "superadmin") {
        const [candidates, clients, tags, designations] = await Promise.all([
          Candidate.count(),
          Client.count({where: {Status: "Active"}}),
          Tag.count(),
          Designation.count(),
        ]);
        //find recent 5 candidates with attributes name location experience designation
        const recentCandidates = await Candidate.findAll({
          limit: 5,
          order: [["createdAt", "DESC"]],
          attributes: ["id","name","city", "workExp", "designationId"],
          include: [
            {
              model: Designation,
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
        const client = await Client.findOne({ where: { userId: req.user.id } });

        if (!client) {
          return res.status(404).json({ success: false, message: "Client not found" });
        }

        const clientTags = await ClientTags.findAll({ where: { ClientId: client.id } });
        const tagIds = clientTags.map((tag) => tag.tagId);

        const candidates = await Candidate.count({
          
          distinct: true, // Ensures each candidate is counted only once
          col: 'id',      // Specify the column to check for distinct values
          include: [{
            model: Tag,
            as: "tags",
            where: {
              [Op.or]: {
                id: tagIds,
                Created_By: req.user.id,
              },
            },
          }],
        });
        //count tags created by client
        const createdtags = await Tag.findAll({ where: { Created_By: req.user.id } });
        //count created candidates by client by using tag
        const createdCandidates = await Candidate.count({
          include: [{
            model: Tag,
            as: "tags",
            where: {
              [Op.and]: {
                id: createdtags.map((tag) => tag.id),
                Created_By: req.user.id,
              },
            },
          }],
        });

        return res.status(200).json({
          success: true,
          data: { candidates, createdtags:createdtags.length, createdCandidates,tags:tagIds.length },
        });

      }

      res.status(400).json({ success: false, message: "Invalid user type" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }),
  dashboardData1: asyncHandler(async (req: CustomRequest, res: Response): Promise<any> => {

    try {

      const user = await User.findOne({

        where: { id: req.user.id },

        attributes: ["id", "Type"],

      });


      if (!user) {

        return res.status(404).json({ success: false, message: "User  not found" });

      }


      if (user.Type === "superadmin") {

        // Fetch the top 5 tags with the number of candidates associated with them

        const tagCounts: { id: any; Tag_Name: any; candidateCount: any; }[] = await sequelize.query(`

          SELECT t.id, t.Tag_Name, COUNT(ct.candidateId) AS candidateCount

          FROM Tag t

          LEFT JOIN candidate_tags ct ON t.id = ct.tagId

          GROUP BY t.id

          ORDER BY candidateCount DESC

          LIMIT 5

        `, {

          type: QueryTypes.SELECT,

        });


        // Fetch the top 5 tags with the number of clients associated with them

        const clientTagCounts: { id: any; Tag_Name: any; clientCount: any; }[] = await sequelize.query(`

          SELECT t.id, t.Tag_Name, COUNT(ct.ClientId) AS clientCount

          FROM Tag t

          LEFT JOIN Client_tags ct ON t.id = ct.tagId

          GROUP BY t.id

          ORDER BY clientCount DESC

          LIMIT 5

        `, {

          type: QueryTypes.SELECT,

        });


        return res.status(200).json({

          success: true,

          data: {

            candidateTags: tagCounts.map((tag: { id: any; Tag_Name: any; candidateCount: any; }) => ({

              id: tag.id,

              name: tag.Tag_Name,

              candidateCount: tag.candidateCount,

            })),

            clientTags: clientTagCounts.map((tag: { id: any; Tag_Name: any; clientCount: any; }) => ({

              id: tag.id,

              name: tag.Tag_Name,

              clientCount: tag.clientCount,

            })),

          },

        });

      }


      if (user.Type === "client") {

        // Fetch the client's associated tags

        const client = await Client.findOne({ where: { userId: req.user.id } });


        if (!client) {

          return res.status(404).json({ success: false, message: "Client not found" });

        }


        // Fetch the top 5 tags associated with the client's candidates

        const tagCounts: { id: any; Tag_Name: any; candidateCount: any; }[] = await sequelize.query(`

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

          type: QueryTypes.SELECT,

        });


        // Fetch the top 5 tags associated with the client

        const clientTagCounts: { id: any; Tag_Name: any; candidateCount: any; }[] = await sequelize.query(`
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
          type: QueryTypes.SELECT,
        });


        return res.status(200).json({
          success: true,
          data: {
            candidateTags: tagCounts.map((tag: { id: any; Tag_Name: any; candidateCount: any; }) => ({
              id: tag.id,
              name: tag.Tag_Name,
              candidateCount: tag.candidateCount,
            })),
            clientTags: clientTagCounts.map((tag: { id: any; Tag_Name: any; candidateCount: any; }) => ({
              id: tag.id,
              name: tag.Tag_Name,
              clientCount: tag.candidateCount,
            })),
          },
        });

      }


      res.status(400).json({ success: false, message: "Invalid user type" });

    } catch (error: any) {

      res.status(500).json({ success: false, message: error.message });

    }

  }),
};

export default DashboardCtr;
