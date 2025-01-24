import {Model, DataTypes, Optional} from "sequelize";
import sequelize from "../../dbconfig/dbconfig";

interface RegionAttributes {
  id: number;
  Name: string;
}
interface RegionCreationAttributes extends Optional<RegionAttributes, "id"> {}

class Region
  extends Model<RegionAttributes, RegionCreationAttributes>
  implements RegionAttributes
{
  public id!: number;
  public Name!: string;
}

Region.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "Regions",
    sequelize,
    timestamps: true,
  }
);

export default Region;
