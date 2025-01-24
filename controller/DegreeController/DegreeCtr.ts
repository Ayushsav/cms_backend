import asyncHandler from "express-async-handler";
import {CustomRequest} from "../../typeReq/customReq";
import {Response} from "express";
import {StatusCodes} from "http-status-codes";
import Degree from "../../modals/DegreeProgram/Degree";
import {Op} from "sequelize";
import sequelize from "../../dbconfig/dbconfig";
const DegreeCtr = {
    // create Degree
    createDegreeCtr: asyncHandler(
        async (req: CustomRequest, res: Response): Promise<any> => {
        try {
            const {name, level, duration} = req.body;
            if (!name || !level || !duration) {
            res.status(StatusCodes.BAD_REQUEST);
            throw new Error("Please provide all required fields");
            }
            // check Degree existance by name
            const DegreeExists: any = await Degree.findOne({where: {name}});
            if (DegreeExists) {
            res.status(StatusCodes.CONFLICT);
            throw new Error("Degree Already Exists");
            }
            const response: any = await Degree.create({
            name,
            level,
            duration,
            });

            return res
            .status(StatusCodes.CREATED)
            .json({message: "Degree created successfully", success: true, result: response});
        } catch (error: any) {
            throw new Error(error?.message);
        }
        }
    ),
    
    //   fetch Degree ctr
    fetchDegreeCtr: asyncHandler(
        async (req: CustomRequest, res: Response): Promise<any> => {
        try {
            const response: any = await Degree.findAll();
    
            if (!response) {
            res.status(StatusCodes.NOT_FOUND);
            throw new Error("Degree Not Found");
            }
    
            return res
            .status(StatusCodes.OK)
            .json({message: "Degree fetched successfully", success: true, result: response});
        } catch (error: any) {
            throw new Error(error?.message);
        }
        },

    ),
    fetchDegreeByIdCtr: asyncHandler(
        async (req: CustomRequest, res: Response): Promise<any> => {
        try {
            const {id} = req.params;
            const response: any = await Degree.findByPk(id);
    
            if (!response) {
            res.status(StatusCodes.NOT_FOUND);
            throw new Error("Degree Not Found");
            }
    
            return res
            .status(StatusCodes.OK)
            .json({message: "Degree fetched successfully", success: true, result: response});
        } catch (error: any) {
            throw new Error(error?.message);
        }
        },
       
    ),
    
     fetchDegreeByNameCtr: asyncHandler(
        async (req: CustomRequest, res: Response): Promise<any> => {
        try {
            const { name } = req.body;



// Convert the input name to lowercase to ensure case-insensitive comparison
const searchName = name.toLowerCase();

// Perform a case-insensitive search using `LOWER` and `Op.like` in MySQL
const response: any = await Degree.findAll({
  where: sequelize.where(
    sequelize.fn('LOWER', sequelize.col('name')),  // Convert the 'name' column to lowercase
    { [Op.like]: `%${searchName}%` }  // Use LIKE for partial matching
  ),
});
    
            if (!response) {
            res.status(StatusCodes.NOT_FOUND);
            throw new Error("Degree Not Found");
            }
    
            return res
            .status(StatusCodes.OK)
            .json({message: "Degree fetched successfully", success: true, result: response});
        } catch (error: any) {
            throw new Error(error?.message);
        }
        },
    ),
    updateDegreeCtr: asyncHandler(
        async (req: CustomRequest, res: Response): Promise<any> => {
        try {
            const {id} = req.params;
            const {name, level, duration} = req.body;
            if (!name || !level || !duration) {
            res.status(StatusCodes.BAD_REQUEST);
            throw new Error("Please provide all required fields");
            }
            const checkDegree: any = await Degree.findByPk(id);
            if (!checkDegree) {
            res.status(StatusCodes.NOT_FOUND);
            throw new Error("Degree Not Found");
            }
            const degreeExists: any = await Degree.findOne({
                where: {
                  name,
                  level,
                  duration,
                  id: { [Op.ne]: id } // Ensure the degree with the same name, level, and duration but different id
                }
              });
            if (degreeExists) {
            res.status(StatusCodes.CONFLICT);
            throw new Error("Degree Already Exists");
            }
            await checkDegree.update({name, level, duration});

            return res
            .status(StatusCodes.OK)
            .json({message: "Degree updated successfully", success: true, result:checkDegree });
        } catch (error: any) {
            throw new Error(error?.message);
        }
        },
    ),
    deleteDegreeCtr: asyncHandler(
        async (req: CustomRequest, res: Response): Promise<any> => {
        try {
            const {id} = req.params;
            const response: any = await Degree.destroy({where: {id}});
    
            if (!response) {
            res.status(StatusCodes.NOT_FOUND);
            throw new Error("Degree Not Found");
            }
    
            return res
            .status(StatusCodes.OK)
            .json({message: "Degree deleted successfully", success: true, result: response});
        } catch (error: any) {
            throw new Error(error?.message);
        }
        },
    ),
    };

export default DegreeCtr;