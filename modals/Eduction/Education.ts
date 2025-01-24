// src/models/Education.ts
import {Model, DataTypes, Optional} from "sequelize";
import sequelize from "../../dbconfig/dbconfig";
import Candidate from "../Candidate/Candidate";

interface EducationAttributes {
  id: number;
  candidateId: number;
  ugCourse: string;
  pgCourse: string;
  postPgCourse: string;
}

interface CreateEducationAttributes
  extends Optional<EducationAttributes, "id"> {}

class Education
  extends Model<EducationAttributes, CreateEducationAttributes>
  implements EducationAttributes
{
  public id!: number;
  public candidateId!: number;
  public ugCourse!: string | any;
  public pgCourse!: string | any;
  public postPgCourse!: string | any;
}

Education.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ugCourse: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pgCourse: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    postPgCourse: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    candidateId: {
      type: DataTypes.INTEGER, // Make sure this matches `candidates.id`
      references: {
        model: Candidate, // Reference the Candidate model
        key: "id",
      },
      // onDelete: "SET NULL",
      // onUpdate: "CASCADE",
      // allowNull: true,
    },
  },
  {
    tableName: "educations",
    sequelize,
  }
);

// Candidate - Education (One-to-One)
Candidate.hasOne(Education, {
  foreignKey: "candidateId",
  as: "education",
  onDelete: "CASCADE",
});
Education.belongsTo(Candidate, {
  foreignKey: "candidateId",
  as: "candidate",
  onDelete: "CASCADE",
});
export default Education;
