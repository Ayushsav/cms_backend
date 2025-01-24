import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Op, WhereOptions, Sequelize, QueryTypes } from 'sequelize';
import sequelize from '../../dbconfig/dbconfig';
import ReasonSaveAnswer from '../../modals/ReasonSaveAnswer/ReasonSaveAnswer';
import ReasonsForLeaving from '../../modals/ReasonForLeaving/ReasonForLeaving';
import ReasonAnswer from '../../modals/ReasonAnswer/ReasonAnswer';
import Candidate from '../../modals/Candidate/Candidate';
import ClientTags from '../../modals/ClientTags';
import Client from '../../modals/Client/Client';
import { CustomRequest } from '../../typeReq/customReq';
import User from '../../modals/User/User';
import Tag from '../../modals/Tag/Tag';

const answerCandidateController = {
    // Get distribution of answers/reasons across all candidates
    getAnswerDistribution: asyncHandler(async (req: CustomRequest, res: Response): Promise<any> => {
        try {
    
          const user = await User.findOne({
    
              where: { id: req.user.id },
    
              attributes: ['id', 'Type'],
    
          });
    
    
          if (!user) {
    
              res.status(404).json({ success: false, message: 'User  not found' });
              return;
    
          }
          let distribution: any[] = [];
          if (user.Type === 'superadmin') {
        distribution = await ReasonSaveAnswer.findAll({
            attributes: [
                'answer',
                [sequelize.fn('COUNT', sequelize.col('candidateId')), 'candidateCount']
            ],
            include: [{
                model: ReasonAnswer,
                attributes: ['Reason_answer'],
                required: true
            }],
            group: ['answer', 'ReasonAnswer.id', 'ReasonAnswer.Reason_answer'],
            raw: true
        });
    
        
    }
    else if (user.Type === 'client') {
        const client = await Client.findOne({ where: { userId: req.user.id } });


          if (!client) {

              res.status(404).json({ success: false, message: "Client not found" });
              return;

          }


          const clientTags = await ClientTags.findAll({ where: { ClientId: client.id } });

          const tagIds = clientTags.map((tag) => tag.tagId);

        
          distribution = await ReasonSaveAnswer.findAll({
            attributes: [
                'answer',
                [sequelize.fn('COUNT', sequelize.col('ReasonSaveAnswer.candidateId')), 'candidateCount']
            ],
            include: [{
                model: ReasonAnswer,
                attributes: ['Reason_answer'],
                required: true
            },
            {
                model: Candidate,
                as: 'candidate', // Specify the alias here
                attributes: [],
                required: true,
                include: [{
                    model: Tag,
                    as: 'tags', // Specify the alias here
                    attributes: [],
                    required: true,
                    through: { attributes: [] },
                    where: {
                        [Op.or]: [
                            { id: { [Op.in]: tagIds } },
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
            answer: (item as any)['ReasonAnswer.Reason_answer'],
            candidateCount: item.candidateCount
        }));
    
        // Use a Set to track unique answers
        const uniqueAnswers = new Set();
        const finalData: Array<{ answer: string; candidateCount: number }> = [];
    
        // Aggregate counts for unique answers
        sortedDistribution.forEach(item => {
            if (!uniqueAnswers.has(item.answer)) {
                uniqueAnswers.add(item.answer);
                finalData.push({ answer: item.answer, candidateCount: item.candidateCount });
            } else {
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
    } catch (error: any) {
        res.status(500).json({ success: false, message: error?.message });
    }
          

    }),

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
    getAnswersByDemographics: asyncHandler(async (req: CustomRequest, res: Response): Promise<any> => {
        try {
    
          const user = await User.findOne({
    
              where: { id: req.user.id },
    
              attributes: ['id', 'Type'],
    
          });
    
    
          if (!user) {
    
              res.status(404).json({ success: false, message: 'User  not found' });
              return;
    
          }
          let demographics: any[];
          if (user.Type === 'superadmin') {
        demographics = await sequelize.query(`
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
            type: QueryTypes.SELECT
        });
    
        res.json(demographics);
    }
    else if (user.Type === 'client') {
        const client = await Client.findOne({ where: { userId: req.user.id } });


        if (!client) {
  
            res.status(404).json({ success: false, message: "Client not found" });
            return;
  
        }
  
  
        const clientTags = await ClientTags.findAll({ where: { ClientId: client.id } });
  
        const tagIds = clientTags.map((tag) => tag.tagId);
        demographics = await sequelize.query(`
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
            type: QueryTypes.SELECT,
            replacements: { tagIds, userId: req.user.id }
        });

        res.json(demographics);
    }
} catch (error: any) {
    res.status(500).json({ success: false, message: error?.message });
}
    }),

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
    getCandidateStatsPerAnswer: asyncHandler(async (req: CustomRequest, res: Response): Promise<any> => {
        try {
    
          const user = await User.findOne({
    
              where: { id: req.user.id },
    
              attributes: ['id', 'Type'],
    
          });
    
    
          if (!user) {
    
              res.status(404).json({ success: false, message: 'User  not found' });
              return;
    
          }
          let stats: any[];
          if (user.Type === 'superadmin') {
         stats = await ReasonAnswer.findAll({
            attributes: [
                'id',
                'Reason_answer',
                [sequelize.fn('COUNT', sequelize.col('ReasonSaveAnswers.candidateId')), 'total_candidates'],
                [
                    sequelize.fn(
                        'COUNT',
                        sequelize.fn('DISTINCT', sequelize.col('ReasonSaveAnswers.candidateId'))
                    ),
                    'unique_candidates'
                ]
            ],
            include: [{
                model: ReasonSaveAnswer,
                attributes: [],
                required: false
            }],
            group: ['ReasonAnswer.id', 'ReasonAnswer.Reason_answer'],
            raw: true
        });

        res.json(stats);
    }
    else if (user.Type === 'client') {
        const client = await Client.findOne({ where: { userId: req.user.id } });


      if (!client) {

          res.status(404).json({ success: false, message: "Client not found" });
          return;

      }


      const clientTags = await ClientTags.findAll({ where: { ClientId: client.id } });

      const tagIds = clientTags.map((tag) => tag.tagId);
      stats = await ReasonAnswer.findAll({
        attributes: [
            'id',
            'Reason_answer',
            [sequelize.fn('COUNT', sequelize.col('ReasonSaveAnswers.candidateId')), 'total_candidates'],
            [
                sequelize.fn(
                    'COUNT',
                    sequelize.fn('DISTINCT', sequelize.col('ReasonSaveAnswers.candidateId'))
                ),
                'unique_candidates'
            ]
        ],
        include: [{
            model: ReasonSaveAnswer,
            as: 'ReasonSaveAnswers', // Specify the alias here
            attributes: [],
            required: false,
            include: [{
                model: Candidate,
                as: 'candidate', // Specify the alias here
                attributes: [],
                required: true,
                include: [{
                    model: Tag,
                    as: 'tags', // Specify the alias here
                    attributes: [],
                    required: true,
                    through: { attributes: [] },
                    where: {
                        [Op.or]: [
                            { id: { [Op.in]: tagIds } },
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
} catch (error: any) {
res.status(500).json({ success: false, message: error?.message });
}
    }),

    // Get answers by candidate experience level
    getAnswersByExperience: asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
        try {
    
          const user = await User.findOne({
    
              where: { id: req.user.id },
    
              attributes: ['id', 'Type'],
    
          });
    
    
          if (!user) {
    
              res.status(404).json({ success: false, message: 'User  not found' });
              return;
    
          }
          let experienceDistribution: any[];
            if (user.Type === 'superadmin') {
        experienceDistribution = await sequelize.query(`
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
            type: QueryTypes.SELECT
        });

        res.json(experienceDistribution);
    } else if (user.Type === 'client') {
        const client = await Client.findOne({ where: { userId: req.user.id } });


        if (!client) {
    
             res.status(404).json({ success: false, message: "Client not found" });
            return;
    
        }
    
    
        const clientTags = await ClientTags.findAll({ where: { ClientId: client.id } });
    
        const tagIds = clientTags.map((tag) => tag.tagId);

        experienceDistribution = await sequelize.query(`
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
            type: QueryTypes.SELECT,
            replacements: { tagIds, userId: req.user.id }
        });
    

    res.json(experienceDistribution);
    }
    }
    catch (error: any) {
        res.status(500).json({ success: false, message: error?.message });
    }

    })
};

export default answerCandidateController;