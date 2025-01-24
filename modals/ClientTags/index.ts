import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../../dbconfig/dbconfig";
import Client from "../Client/Client";
import Tag from "../Tag/Tag";

// Attributes interface
interface ClientTagAttributes {
  ClientId: number;
  tagId: number;
}

// Creation attributes (making ClientId optional during creation)
interface ClientTagCreationAttributes 
  extends Optional<ClientTagAttributes, "ClientId"> {}

// Model class
class ClientTags 
  extends Model<ClientTagAttributes, ClientTagCreationAttributes> 
  implements ClientTagAttributes 
{
  public ClientId!: number;
  public tagId!: number;

  // Optional: Add timestamp fields if needed
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
}

ClientTags.init(
  {
    ClientId: {
      type: DataTypes.INTEGER,
      field: 'ClientId', // Explicitly define the column name
      references: {
        model: Client,
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      primaryKey: true, // Consider adding this if it's part of a composite primary key
    },
    tagId: {
      type: DataTypes.INTEGER,
      field: 'tagId', // Explicitly define the column name
      references: {
        model: Tag,
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      primaryKey: true, // Consider adding this if it's part of a composite primary key
    }
  },
  {
    tableName: "Client_tags",
    sequelize,
    timestamps: false, // Add this if you don't want createdAt and updatedAt
    underscored: false, // Ensure column names match exactly
  }
);

// Associations
Client.belongsToMany(Tag, {
  through: ClientTags,
  foreignKey: "ClientId",
  otherKey: "tagId",
  as: "tags"
});

Tag.belongsToMany(Client, {
  through: ClientTags,
  foreignKey: "tagId",
  otherKey: "ClientId",
  as: "Clients"
});

export default ClientTags;