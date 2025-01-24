// src/models/Degree.ts
import {Model, DataTypes, Optional} from "sequelize";
import sequelize from "../../dbconfig/dbconfig";


interface DegreeAttributes {
  id: number;
  name: string;
  level: string;
  duration: number;

}

interface CreateDegreeAttributes
  extends Optional<DegreeAttributes, "id"> {}

class Degree
  extends Model<DegreeAttributes, CreateDegreeAttributes>
  implements DegreeAttributes
{
  public id!: number;
  public name!: string;
    public level!: string;
    public duration!: number;

}

Degree.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    level: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "Degrees",
    timestamps:false,
    sequelize,
  }
);


export default Degree;
