import asyncHandler from "express-async-handler";
import { Response } from "express";
import Candidate from "../../modals/Candidate/Candidate";
import Designation from "../../modals/Designation/Designation";
import Education from "../../modals/Eduction/Education";
import ReasonsForLeaving from "../../modals/ReasonForLeaving/ReasonForLeaving";
import sequelize from "../../dbconfig/dbconfig";
import Tag from "../../modals/Tag/Tag";
import Client from "../../modals/Client/Client";
import { Op } from "sequelize";
import { CustomRequest } from "../../typeReq/customReq";
import CandidateTags from "../../modals/CandidateTags/CandidateTags";
import ClientTags from "../../modals/ClientTags";
import User from "../../modals/User/User";
import { QueryTypes } from "sequelize";
import ReasonSaveAnswer from "../../modals/ReasonSaveAnswer/ReasonSaveAnswer";
import ReasonAnswer from "../../modals/ReasonAnswer/ReasonAnswer";
interface ExperienceDistribution {
  designationId: number;
  count: number;
}

const AnalyticalCtr = {
  // Candidate Distribution by Designation
  candidateDistribution: asyncHandler(async (req: CustomRequest, res: Response): Promise<any> => {
    try {

      const user = await User.findOne({

          where: { id: req.user.id },

          attributes: ['id', 'Type'],

      });


      if (!user) {

          res.status(404).json({ success: false, message: 'User  not found' });
          return;

      }
      
    let distribution: any[];
    if (user.Type === 'superadmin') {
    distribution = await Candidate.findAll({
      attributes: [
        'designationId',
        [sequelize.fn('COUNT', sequelize.col('Candidate.id')), 'count'], // Explicitly qualify 'id' with the table/alias
      ],
      group: ['designationId'],
      include: [
        {
          model: Designation,
          as: 'designation',
          attributes: ['title'],
        },
      ],
      order: [[sequelize.literal('count'), 'DESC']], // Order by count in descending order
      limit: 10, // Limit to top 10 results
    }) as unknown as ExperienceDistribution[];
  
    res.status(200).json({
      success: true,
      data: distribution,
    });
  } else {
    const client = await Client.findOne({ where: { userId: req.user.id } });


    if (!client) {

        res.status(404).json({ success: false, message: "Client not found" });
        return;

    }


    const clientTags = await ClientTags.findAll({ where: { ClientId: client.id } });

    const tagIds = clientTags.map((tag) => tag.tagId);
    distribution = await Candidate.findAll({
      attributes: [
        'designationId',
        [sequelize.fn('COUNT', sequelize.col('Candidate.id')), 'count'], // Explicitly qualify 'id' with the table/alias
      ],
      group: ['designationId'],
      include: [
        {
          model: Designation,
          as: 'designation',
          attributes: ['title'],
        },
        {
          model: Tag,
          as: "tags",
          attributes: [],
          where: {
            [Op.or]: {
              id: tagIds,
              Created_By: req.user.id,
            },
          },
        },
      ],
      order: [[sequelize.literal('count'), 'DESC']], // Order by count in descending order
      limit: 10, // Limit to top 10 results
    }) as unknown as ExperienceDistribution[];
    
    res.status(200).json({
      success: true,
      data: distribution,
    });
  }
}
catch (error: any) {
  res.status(500).json({ success: false, message: error.message });
}
  }),


  // Work Experience Analysis
  workExperienceAnalysis: asyncHandler(async (req: CustomRequest, res: Response): Promise<any> => {
    try {

      const user = await User.findOne({

          where: { id: req.user.id },

          attributes: ['id', 'Type'],

      });


      if (!user) {

          res.status(404).json({ success: false, message: 'User  not found' });
          return;

      }


      interface ExperienceDistribution {
        '0-1 years': number;
        '1-3 years': number;
        '3-5 years': number;
        '5-10 years': number;
        '10-20 years': number;
      }

      let experienceDistribution: any[];


      if (user.Type === 'superadmin') {

          experienceDistribution = await Candidate.findAll({

              attributes: [

                  [sequelize.fn('SUM', sequelize.literal("CASE WHEN workExp BETWEEN 0 AND 1 THEN 1 ELSE 0 END")), '0-1 years'],

                  [sequelize.fn('SUM', sequelize.literal("CASE WHEN workExp BETWEEN 1 AND 3 THEN 1 ELSE 0 END")), '1-3 years'],

                  [sequelize.fn('SUM', sequelize.literal("CASE WHEN workExp BETWEEN 3 AND 5 THEN 1 ELSE 0 END")), '3-5 years'],

                  [sequelize.fn('SUM', sequelize.literal("CASE WHEN workExp BETWEEN 5 AND 10 THEN 1 ELSE 0 END")), '5-10 years'],

                  [sequelize.fn('SUM', sequelize.literal("CASE WHEN workExp BETWEEN 10 AND 20 THEN 1 ELSE 0 END")), '10-20 years'],

              ],

              raw: true // This will return the result as a plain object

          });

      } else {

          const client = await Client.findOne({ where: { userId: req.user.id } });


          if (!client) {

              res.status(404).json({ success: false, message: "Client not found" });
              return;

          }


          const clientTags = await ClientTags.findAll({ where: { ClientId: client.id } });

          const tagIds = clientTags.map((tag) => tag.tagId);


          experienceDistribution = await Candidate.findAll({

              attributes: [

                  [sequelize.fn('SUM', sequelize.literal("CASE WHEN workExp BETWEEN 0 AND 1 THEN 1 ELSE 0 END")), '0-1 years'],

                  [sequelize.fn('SUM', sequelize.literal("CASE WHEN workExp BETWEEN 1 AND 3 THEN 1 ELSE 0 END")), '1-3 years'],

                  [sequelize.fn('SUM', sequelize.literal("CASE WHEN workExp BETWEEN 3 AND 5 THEN 1 ELSE 0 END")), '3-5 years'],

                  [sequelize.fn('SUM', sequelize.literal("CASE WHEN workExp BETWEEN 5 AND 10 THEN 1 ELSE 0 END")), '5-10 years'],

                  [sequelize.fn('SUM', sequelize.literal("CASE WHEN workExp BETWEEN 10 AND 20 THEN 1 ELSE 0 END")), '10-20 years']

              ],

              // where: {

              //     [Op.or]: {

              //         '$tags.id$': tagIds, // Ensure candidates are filtered by the client's tags
                     
              //     },

              // },

              include: [{

                  model: Tag,

                  as: "tags",

                  required: true, // Ensure that only candidates with tags are included
                  where: {
                      
                        [Op.or]: {
  
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

  } catch (error: any) {

      return res.status(500).json({ success: false, message: error.message });

  }
}),

  // Current CTC Analysis
  currentCTCAnalysis: asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
    try {

      const user = await User.findOne({

          where: { id: req.user.id },

          attributes: ['id', 'Type'],

      });


      if (!user) {

          res.status(404).json({ success: false, message: 'User  not found' });
          return;

      }
      let ctcDistribution: any[];
      if(user.Type === 'superadmin') {
     ctcDistribution = await Candidate.findAll({
      attributes: [
        [
          sequelize.fn(
            'MIN',
            sequelize.cast(sequelize.fn('REPLACE', sequelize.col('currentCTC'), 'LPA', ''), 'UNSIGNED')
          ),
          'minCTC',
        ],
        [
          sequelize.fn(
            'MAX',
            sequelize.cast(sequelize.fn('REPLACE', sequelize.col('currentCTC'), 'LPA', ''), 'UNSIGNED')
          ),
          'maxCTC',
        ],
        [

          sequelize.fn(
            'ROUND',
            sequelize.fn(
              'AVG',
              sequelize.cast(sequelize.fn('REPLACE', sequelize.col('currentCTC'), 'LPA', ''), 'UNSIGNED')
            ),
            2
          ),
          'avgCTC',
        ],
      ],
      where: {
        currentCTC: {
          [Op.not]: '',
          [Op.ne]: '',
          [Op.notLike]: '%null%'
        }
      }
    });

  
    res.status(200).json({
      success: true,
      data: ctcDistribution,
    });
  }
  else {
    const client = await Client.findOne({ where: { userId: req.user.id } });


    if (!client) {

         res.status(404).json({ success: false, message: "Client not found" });
        return;

    }


    const clientTags = await ClientTags.findAll({ where: { ClientId: client.id } });

    const tagIds = clientTags.map((tag) => tag.tagId);

    ctcDistribution = await Candidate.findAll({
      include: [{
        model: Tag,
        as: "tags",
        attributes: [],
        where: {
          [Op.or]: {
            id: tagIds,
            Created_By: req.user.id,
          },
        },
      }],
      attributes: [
        [
          sequelize.fn(
            'MIN',
            sequelize.cast(sequelize.fn('REPLACE', sequelize.col('currentCTC'), 'LPA', ''), 'UNSIGNED')
          ),
          'minCTC',
        ],
        [
          sequelize.fn(
            'MAX',
            sequelize.cast(sequelize.fn('REPLACE', sequelize.col('currentCTC'), 'LPA', ''), 'UNSIGNED')
          ),
          'maxCTC',
        ],
        [

          sequelize.fn(
            'ROUND',
            sequelize.fn(
              'AVG',
              sequelize.cast(sequelize.fn('REPLACE', sequelize.col('currentCTC'), 'LPA', ''), 'UNSIGNED')
            ),
            2
          ),
          'avgCTC',
        ],
      ],
      where: {
        currentCTC: {
          [Op.not]: '',
          [Op.ne]: '',
          [Op.notLike]: '%null%',
        
        },
        
      }
      
    });
    res.status(200).json({
      success: true,
      data: ctcDistribution,
    });
  }
    
  } catch (error: any) {

    res.status(500).json({ success: false, message: error.message });
    return;

}
  }),

 
  geographicalDistribution: asyncHandler(async (req: CustomRequest, res: Response): Promise<any> => {
    try {

      const user = await User.findOne({

          where: { id: req.user.id },

          attributes: ['id', 'Type'],

      });


      if (!user) {

          return res.status(404).json({ success: false, message: 'User  not found' });

      }


      let geoDistribution;


      if (user.Type === 'superadmin') {

          geoDistribution = await Candidate.findAll({

              attributes: ['state', [sequelize.fn('COUNT', sequelize.col('Candidate.id')), 'count']], // Specify the table name

              group: ['state'],

          });

      } else {

          const client = await Client.findOne({ where: { userId: req.user.id } });


          if (!client) {

              return res.status(404).json({ success: false, message: "Client not found" });

          }


          const clientTags = await ClientTags.findAll({ where: { ClientId: client.id } });

          const tagIds = clientTags.map((tag) => tag.tagId);


          geoDistribution = await Candidate.findAll({

              attributes: ['state', [sequelize.fn('COUNT', sequelize.col('Candidate.id')), 'count']], // Specify the table name

              group: ['state'],

              include: [{

                  model: Tag,

                  as: "tags",
                  attributes: [],
                  where: {

                      [Op.or]: {

                          id: tagIds,

                          Created_By: req.user.id,

                      },

                  },
                 
              }],
              

          });

      }


      res.status(200).json({ success: true, data: geoDistribution });

  } catch (error: any) {

      res.status(500).json({ success: false, message: error.message });

  }
  }
  ),

  // Education Level Analysis
  educationLevelAnalysis: asyncHandler(async (req: CustomRequest, res: Response): Promise<any> => {
    try {

      const user = await User.findOne({

          where: { id: req.user.id },

          attributes: ['id', 'Type'],

      });


      if (!user) {

          res.status(404).json({ success: false, message: 'User  not found' });
          return;

      }
      let educationDistribution: any[];
      if (user.Type === 'superadmin') {
     educationDistribution = await Candidate.findAll({
        include: [
            {
            model: Education,
            as: 'education',
            attributes: [],
            },
        ],
        attributes: [
            [sequelize.fn('COUNT', sequelize.col('education.ugCourse')), 'ugCount'],
            [sequelize.fn('COUNT', sequelize.col('education.pgCourse')), 'pgCount'],
            [sequelize.fn('COUNT', sequelize.col('education.postPgCourse')), 'postPgCount'],
        ],
    });
    res.json(educationDistribution);}
    else {
      const client = await Client.findOne({ where: { userId: req.user.id } });


      if (!client) {

          res.status(404).json({ success: false, message: "Client not found" });
          return;

      }


      const clientTags = await ClientTags.findAll({ where: { ClientId: client.id } });

      const tagIds = clientTags.map((tag) => tag.tagId);
      educationDistribution = await Candidate.findAll({
        include: [
            {
            model: Education,
            as: 'education',
            attributes: [],
            },
            {
              model: Tag,
              as: "tags",
              attributes: [],
              where: {
                  [Op.or]: {
                      id: tagIds,
                      Created_By: req.user.id,
                  },
              },
            }
        ],
        attributes: [
            [sequelize.fn('COUNT', sequelize.col('education.ugCourse')), 'ugCount'],
            [sequelize.fn('COUNT', sequelize.col('education.pgCourse')), 'pgCount'],
            [sequelize.fn('COUNT', sequelize.col('education.postPgCourse')), 'postPgCount'],
        ],
    });
    res.json(educationDistribution);
  }
}
catch (error: any) {
  res.status(500).json({ success: false, message: error.message });
}

  }),

  


  // Client Status Analysis (Assuming you have a Client model)
  clientStatusAnalysis: asyncHandler(async (req, res: Response) => {
    // This is a placeholder. You need to implement the Client model and its relationships.
    const clientStatus = await Client.findAll({
      attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['status'],
    });
    res.json(clientStatus);
  }),

  // Tag Analysis for Candidates
  tagAnalysis: asyncHandler(async (req: CustomRequest, res: Response): Promise<any> => {
    try {

      const user = await User.findOne({

          where: { id: req.user.id },

          attributes: ['id', 'Type'],

      });


      if (!user) {

          res.status(404).json({ success: false, message: 'User  not found' });
          return;

      }
      let tagDistribution: any[];
      let topTags: any[] = [];
      if (user.Type === 'superadmin') {
     tagDistribution = await sequelize.query(`
      SELECT t.Tag_Name as tag, COUNT(ct.tagId) as count
      FROM Tag t
      INNER JOIN candidate_tags ct ON t.id = ct.tagId
      GROUP BY t.id, t.Tag_Name
    `, {
      type: QueryTypes.SELECT,
      raw: true
    });

    // Sort tags by count in descending order
    tagDistribution.sort((a: any, b: any) => b.count - a.count);

    // Get top 5 tags
    topTags = tagDistribution.slice(0, 5);

    // Group remaining tags under "Other"
    // const otherTagsCount = tagDistribution.slice(5).reduce((acc: number, tag: any) => acc + tag.count, 0);
    // if (otherTagsCount > 0) {
    //     topTags.push({ tag: 'Other', count: otherTagsCount });
    // }

    
  }
  else if (user.Type === 'client') {
    const client = await Client.findOne({ where: { userId: req.user.id } });


      if (!client) {

          res.status(404).json({ success: false, message: "Client not found" });
          return;

      }


      const clientTags = await ClientTags.findAll({ where: { ClientId: client.id } });

      const tagIds = clientTags.map((tag) => tag.tagId);
      //now we need to filter using tagIds and Created_By
      tagDistribution = await sequelize.query(`
      SELECT t.Tag_Name as tag, COUNT(ct.tagId) as count
      FROM Tag t
      INNER JOIN candidate_tags ct ON t.id = ct.tagId
      WHERE ct.tagId IN (${tagIds.join(',')}) OR t.Created_By = ${req.user.id}
      GROUP BY t.id, t.Tag_Name
    `, {
      type: QueryTypes.SELECT,
      raw: true
    });
    
    // Sort tags by count in descending order
    tagDistribution.sort((a: any, b: any) => b.count - a.count);

    // Get top 5 tags
    topTags = tagDistribution.slice(0, 5);
    // const otherTagsCount = tagDistribution.slice(5).reduce((acc: number, tag: any) => acc + tag.count, 0);
    // if (otherTagsCount > 0) {
    //     topTags.push({ tag: 'Other', count: otherTagsCount });
    // }
   
  }
  res.json(topTags);
}
catch (error: any) {
  res.status(500).json({ success: false, message: error.message });
}

}),

  // Candidate Age Distribution
  candidateAgeDistribution: asyncHandler(async (req: CustomRequest, res: Response) => {
    try{
      const user = await User.findOne({

        where: { id: req.user.id },

        attributes: ['id', 'Type'],

    });


    if (!user) {

        res.status(404).json({ success: false, message: 'User  not found' });
        return;

    }
    let ageDistribution: any[];
    const currentYear = new Date().getFullYear();
    if (user.Type === 'superadmin') {
    
     ageDistribution = await Candidate.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.literal(`CASE WHEN YEAR(dob) BETWEEN ${currentYear - 25} AND ${currentYear - 20} THEN 1 ELSE 0 END`)), '20-25'],
        [sequelize.fn('SUM', sequelize.literal(`CASE WHEN YEAR(dob) BETWEEN ${currentYear - 30} AND ${currentYear - 26} THEN 1 ELSE 0 END`)), '26-30'],
        [sequelize.fn('SUM', sequelize.literal(`CASE WHEN YEAR(dob) BETWEEN ${currentYear - 35} AND ${currentYear - 31} THEN 1 ELSE 0 END`)), '31-35'],
        [sequelize.fn('SUM', sequelize.literal(`CASE WHEN YEAR(dob) < ${currentYear - 35} THEN 1 ELSE 0 END`)), '35+'],
      ],
    });
    res.json(ageDistribution);
  } else {
    const client = await Client.findOne({ where: { userId: req.user.id } });


      if (!client) {

          res.status(404).json({ success: false, message: "Client not found" });
          return;

      }


      const clientTags = await ClientTags.findAll({ where: { ClientId: client.id } });

      const tagIds = clientTags.map((tag) => tag.tagId);
      ageDistribution = await Candidate.findAll({
        attributes: [
          [sequelize.fn('SUM', sequelize.literal(`CASE WHEN YEAR(dob) BETWEEN ${currentYear - 25} AND ${currentYear - 20} THEN 1 ELSE 0 END`)), '20-25'],
          [sequelize.fn('SUM', sequelize.literal(`CASE WHEN YEAR(dob) BETWEEN ${currentYear - 30} AND ${currentYear - 26} THEN 1 ELSE 0 END`)), '26-30'],
          [sequelize.fn('SUM', sequelize.literal(`CASE WHEN YEAR(dob) BETWEEN ${currentYear - 35} AND ${currentYear - 31} THEN 1 ELSE 0 END`)), '31-35'],
          [sequelize.fn('SUM', sequelize.literal(`CASE WHEN YEAR(dob) < ${currentYear - 35} THEN 1 ELSE 0 END`)), '35+'],
        ],
        include: [{

          model: Tag,

          as: "tags",
          attributes: [],
          where: {

              [Op.or]: {

                  id: tagIds,

                  Created_By: req.user.id,

              },

          },
         
      }],
      });
      res.json(ageDistribution);
    }
  }
  catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }

  }),
  

  
  


 
};

export default AnalyticalCtr;