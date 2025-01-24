import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../../dbconfig/dbconfig";

interface SecurityQuestionAttributes {
  id: number;
    questionText: string;
}

interface SecurityQuestionCreateAttributes
  extends Optional<SecurityQuestionAttributes, "id"> {}

class SecurityQuestion
  extends Model<SecurityQuestionAttributes, SecurityQuestionCreateAttributes>
  implements SecurityQuestionAttributes
{
  public id!: number;
    public questionText!: string;
}

SecurityQuestion.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    questionText: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    timestamps: false,
    modelName: 'SecurityQuestion',
  });

export default SecurityQuestion;
