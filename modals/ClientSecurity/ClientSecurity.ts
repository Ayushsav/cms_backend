import {DataTypes, Model, Optional} from "sequelize";
import sequelize from "../../dbconfig/dbconfig";
interface ClientSecurityAttributes {
  id: number;
  ClientId: number;
  QuestionId: number;
  Answer: string;
}

interface ClientSecurityCreationAttributes
  extends Optional<ClientSecurityAttributes, "id"> {}

class ClientSecurity
  extends Model<ClientSecurityAttributes, ClientSecurityCreationAttributes>
  implements ClientSecurityAttributes
{
  public id!: number;
  public ClientId!: number;
  public QuestionId!: number;
  public Answer!: string;
}

ClientSecurity.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ClientId: {
      type: DataTypes.INTEGER,
    },
    QuestionId: {
      type: DataTypes.INTEGER,
    },
    Answer: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
    sequelize,
  }
);

export default ClientSecurity;
