import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../../dbconfig/dbconfig";
import User from "../User/User";
import SecurityQuestion from "../SecurityQuestions/index";

interface UserSecurityAnswerAttributes {
    id: number;
    userId: number;
    questionId: number;
    answerHash: string;
}

interface UserSecurityAnswerCreateAttributes
  extends Optional<UserSecurityAnswerAttributes, "id"> {}

class UserSecurityAnswer
  extends Model<UserSecurityAnswerAttributes, UserSecurityAnswerCreateAttributes>
  implements UserSecurityAnswerAttributes
{
    public id!: number;
    public userId!: number;
    public questionId!: number;
    public answerHash!: string;

}

UserSecurityAnswer.init({
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
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: SecurityQuestion,
        key: 'id',
      },
    },
    answerHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'UserSecurityAnswer',
  });

  //write associations here hasone and belongs
    UserSecurityAnswer.belongsTo(User, {
        foreignKey: 'userId',
        as: 'user',
    });
    User.hasOne(UserSecurityAnswer, {
        foreignKey: 'userId',
        as: 'userSecurityAnswer',
    });
  //write associations here for question
    UserSecurityAnswer.belongsTo(SecurityQuestion, {
        foreignKey: 'questionId',
        as: 'securityQuestion',
    });
    SecurityQuestion.hasOne(UserSecurityAnswer, {
        foreignKey: 'questionId',
        as: 'userSecurityAnswer',
    });

export default UserSecurityAnswer;
