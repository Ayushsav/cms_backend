// src/models/ReasonsForLeaving.ts
import {Model, DataTypes, Optional} from "sequelize";
import sequelize from "../../dbconfig/dbconfig";
import Candidate from "../Candidate/Candidate";

interface ReasonAttributes {
  id: number;
  reason: string;
}

interface ReasonCreateAttributes extends Optional<ReasonAttributes, "id"> {}

class ReasonsForLeaving
  extends Model<ReasonAttributes, ReasonCreateAttributes>
  implements ReasonAttributes
{
  [x: string]: any;
  public id!: number;
  public reason!: string;
}

ReasonsForLeaving.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "reasons_for_leaving",
    sequelize,
    timestamps: true,
  }
);

export default ReasonsForLeaving;
