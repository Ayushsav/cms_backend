import {DataTypes, Model, Optional} from "sequelize";
import sequelize from "../../dbconfig/dbconfig";
import {ref} from "joi";
import User from "../User/User";
interface TagAttributes {
  id: number;
  Tag_Name: string;
  Created_By: number;
}

interface CreateTagAttributes extends Optional<TagAttributes, "id"> {}

class Tag
  extends Model<TagAttributes, CreateTagAttributes>
  implements TagAttributes
{
  public id!: number;
  public Tag_Name!: string;
  public Created_By!: number;
}

Tag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Tag_Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Created_By: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    tableName: "Tag",
    sequelize,
    timestamps: true,
  }
);

//write associations here hasone and belongs
Tag.belongsTo(User, {
  foreignKey: "Created_By",
  as: "user",
  onDelete: "CASCADE",
});
User.hasOne(Tag, {
  foreignKey: "Created_By",
  as: "tag",
  onDelete: "CASCADE",
});

export default Tag;
