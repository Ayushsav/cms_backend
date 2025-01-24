import asyncHandler from "express-async-handler";
import {CustomRequest} from "../../typeReq/customReq";
import {Response} from "express";
import User from "../../modals/User/User";
import {StatusCodes} from "http-status-codes";
import Tag from "../../modals/Tag/Tag";
import fs from "fs";
import path from "path";
import {Op, or} from "sequelize";
import {format} from "fast-csv";
import csv from "csv-parser";
import ClientTags from "../../modals/ClientTags";
import Client from "../../modals/Client/Client";

const TagCtr = {
  // create tags
  createtagCtr: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        const user = await User.findOne({
          where: {id: req.user.id},
          attributes: ["id", "Type"],
        });
        if (!user) {
          return res.status(404).json({success: false, message: "User not found"});
        }
        const {Tag_Name} = req.body;

        // check User existance
        // const userExists: number | unknown = await User.findByPk(req.user);
        // if (!userExists) {
        //   res.status(404);
        //   throw new Error("User Not Found Please Login !");
        // }
        if (!Tag_Name || typeof Tag_Name !== "string") {
          return res
            .status(400)
            .json({error: "Tag_Name is required and must be a string."});
        }
        //check if tag already exist
        const checktags = await Tag.findOne({
          where: {
            [Op.or]: [{Tag_Name: Tag_Name}],
          },
        });
        if (checktags) {
          res.status(StatusCodes.CONFLICT);
          throw new Error("Tag already exist");
        }
        const additmes = await Tag.create({
          Tag_Name,
          Created_By: req.user.id,
        });
        if (!additmes) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("tag not found");
        }
        if (additmes && user.Type === "client"){
          //find client id
          const client = await Client.findOne({
            where: {userId: req.user.id},
          });
          if (!client) {
            res.status(StatusCodes.NOT_FOUND);
            throw new Error("Client not found");
          }
          await ClientTags.create({
            ClientId: client.id,
            tagId: additmes.id,
        }
        );
        }
        
        return res.status(StatusCodes.CREATED).json({
          message: "Tag created successfully",
          success: true,
          result: additmes,
        });
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  ),
  //   fetch tags
  fetchtagsCtr: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        
        const userExists = await User.findOne({
          where: {id: req.user.id},
          attributes: ["id", "Type"],
        });
        if (userExists?.Type === "client") {
          const client = await Client.findOne({
            where: {userId: req.user.id},
          });
          const clientTags = await ClientTags.findAll({
            where: {ClientId: client?.id},
          });
          const tagIds = clientTags.map((tag) => tag.tagId);
          
          const fetchitmes = await Tag.findAll({
            where: {
              [Op.or]: [
                { id: tagIds },
                { Created_By: req.user.id }
              ]
            },
          });
          if (!fetchitmes) {
            res.status(StatusCodes.NOT_FOUND);
            throw new Error("");
          }
          return res.status(StatusCodes.OK).json({
            message: "tags fetch successfully",
            success: true,
            result: fetchitmes,
          });
        }
        else{

        const fetchitmes = await Tag.findAll();
        if (!fetchitmes) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("");
        }
        return res.status(StatusCodes.OK).json({
          message: "tags fetch successfully",
          success: true,
          result: fetchitmes,
        });
      }
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  ),

  //   remove tags

  removetagsCtr: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        // check User existance
        // const userExists: number | unknown = await User.findByPk(req.user);
        // if (!userExists) {
        //   res.status(404);
        //   throw new Error("User Not Found Please Login !");
        // }

        const checktags = await Tag.findByPk(req.params.id);
        if (!checktags) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("");
        } else {
          await checktags.destroy();
        }
        return res
          .status(StatusCodes.OK)
          .json({message: "remove items successfully", success: true});
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  ),

  //    edit tags ctr
  updatetagctr: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
      
        const checktags = await Tag.findByPk(req.params.id);
        //check Tag Name already exist
        if (!checktags) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("Tag not found");
        } else {
          if (req.body.Tag_Name) {
            //check if tag already exist
            const checktagss = await Tag.findOne({
              where: {
                [Op.or]: [{Tag_Name: req.body.Tag_Name}],
              },
            });
            if (checktagss) {
              res.status(StatusCodes.CONFLICT);
              throw new Error("Tag already exist");
            }
            else{
              await checktags.update({Tag_Name: req.body.Tag_Name});
            }
          }
          
        }
        return res.status(StatusCodes.OK).json({
          message: "tag updated successfully",
          success: true,
          result: checktags,
        });
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  ),

  //   imported Tags
  importTagsCtr: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        console.log(req.file);
        if (!req.file) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({message: "No file uploaded"});
        }

        const filePath = path.join(
          __dirname,
          "../../uploads/",
          req.file.filename
        );
        const TagsData: any[] = [];
        console.log(`Processing file: ${filePath}`);

        // Read the CSV file
        fs.createReadStream(filePath)
          .pipe(csv())
          .on("data", (row: any) => {
            TagsData.push(row);
          })
          .on("end", async () => {
            let importedCount = 0;
            const errors: string[] = [];

            // Process the Tags data
            for (const data of TagsData) {
              try {
                // Basic validations
                if (!data["Tags Name"]) {
                  errors.push(
                    `Missing required fields for candidate: ${
                      data["Tags Name"] || "Unknown"
                    }`
                  );
                  continue;
                }
                //find or create tag
                // const [tag, created] = await Tag.findOrCreate({
                //   where: {Tag_Name: data["Tags Name"]},
                  
                // });
                const tag = await Tag.findOne({
                  where: {
                    [Op.or]: [{Tag_Name: data["Tags Name"]}],
                  },
                });
                if (tag) {
                  errors.push(
                    `Tag: ${data["Tags Name"]} already exists.`
                  );
                  continue;
                }
                const created = await Tag.create({
                  Tag_Name: data["Tags Name"],
                  Created_By: req.user.id,
                });
                if (created) {
                  importedCount++;
                }
              } catch (err: any) {
                errors.push(
                  `Failed to import Tag: ${data["Tags Name"]}. Error: ${err.message}`
                );
              }
            }

            // Delete the file after processing
            fs.unlinkSync(filePath);

            // Return the response with success and error details
            return res.status(StatusCodes.OK).json({
              success: true,
              message: `${importedCount} Tags imported successfully`,
              result: TagsData,
              importedCount,
              errors,
            });
          });
      } catch (error: any) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({message: error.message});
      }
    }
  ),
  returntagsCsvFile: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        const tagsFields = ["Tags Name"];
        // Generate a CSV file dynamically
        const filePath = path.join(__dirname, "../../uploads/template.csv");

        // Create a write stream to save the CSV
        const writeStream = fs.createWriteStream(filePath);

        // Write data using fast-csv
        const csvStream = format({headers: true});
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
              res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Failed to download template CSV",
              });
            }
          });
        });
      } catch (error: any) {
        console.error(error);
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({error: error.message});
      }
    }
  ),
};

export default TagCtr;
