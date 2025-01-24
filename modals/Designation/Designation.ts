import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../../dbconfig/dbconfig";

interface DesignationAttributes {
  id: number;
  title: string;
}

interface DesignationCreateAttributes
  extends Optional<DesignationAttributes, "id"> {}

class Designation
  extends Model<DesignationAttributes, DesignationCreateAttributes>
  implements DesignationAttributes
{
  public id!: number;
  public title!: string;
}

Designation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "designations",
    timestamps: false,
    sequelize,
  }
);

export default Designation;
