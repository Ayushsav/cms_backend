import {Model, DataTypes, Optional} from "sequelize";
import sequelize from "../../dbconfig/dbconfig";
import User from "../User/User";
interface ClientAttributes {
  id: number;
  // FirstName: string;
  // LastName: string;
  // Email: string;
  // Phone: number;
  userId: number;
  Address: string;
  PostCode: string;
  GstNumber: string;
  Status: "Active" | "InActive";
}

interface ClientCreationAttributes extends Optional<ClientAttributes, "id"> {}

class Client
  extends Model<ClientAttributes, ClientCreationAttributes>
  implements ClientAttributes
{
  public id!: number;
  public userId!: number;
  
  public Address!: string;
  public PostCode!: string;
  public GstNumber!: string;
  public Status!: "Active" | "InActive";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public user?: User; 
  public tags?: any;
}

Client.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
   
    Address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    PostCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    GstNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [9, 15], // GST number length validation
      },
    },
    Status: {
      type: DataTypes.ENUM,
      values: ["Active", "InActive"],
      allowNull: false,
      defaultValue: "Active",
    },
  },
  {
    tableName: "Client", // Pluralized table name
    sequelize,
    timestamps: true, // Includes createdAt and updatedAt fields
  }
);
Client.belongsTo(User, { foreignKey: "userId", as: "user",onDelete: "CASCADE" });
User.hasOne(Client, { foreignKey: "userId", as: "client",onDelete: "CASCADE" });

export default Client;
