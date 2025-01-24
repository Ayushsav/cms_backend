import {Model, DataTypes, Optional} from "sequelize";
import sequelize from "../../dbconfig/dbconfig";
import ReasonsForLeaving from "../ReasonForLeaving/ReasonForLeaving";
import Candidate from "../Candidate/Candidate";
import ReasonAnswer from "../ReasonAnswer/ReasonAnswer";

interface ReasonSaveAnswerAttributes {
  id: number;
  candidateId: number;
  questionId: number;
  answer: number;
}

interface ReasonSaveAnswerCreationAttributes
  extends Optional<ReasonSaveAnswerAttributes, "id"> {}

class ReasonSaveAnswer
  extends Model<ReasonSaveAnswerAttributes, ReasonSaveAnswerCreationAttributes>
  implements ReasonSaveAnswerAttributes
{
  public id!: number;
  public candidateId!: number;
  public questionId!: number;
  public answer!: number;
  date: any;
    candidateCount: any;
    ReasonAnswer: any;
}

ReasonSaveAnswer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    candidateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Candidate,
        key: "id",
      },
    },
    questionId: {
      type: DataTypes.INTEGER, // Updated to match ReasonsForLeaving.id type
      allowNull: false,
      references: {
        model: ReasonsForLeaving,
        key: "id",
      },
    },
    answer: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ReasonAnswer,
        key: "id",
      },
    },
  },
  {
    tableName: "ReasonSaveAnswer",
    sequelize,
    timestamps: true, // Enable timestamps if needed
    freezeTableName: true, // Prevent Sequelize from pluralizing table name
  }
);



//assciation

ReasonSaveAnswer.belongsTo(Candidate, {
  foreignKey: "candidateId",
  as: "candidate",
  onDelete: "CASCADE",
});

ReasonSaveAnswer.belongsTo(ReasonsForLeaving, {
  foreignKey: "questionId",
  as: "reason",
  onDelete: "CASCADE",
});

ReasonsForLeaving.hasMany(ReasonSaveAnswer, {
  foreignKey: "questionId",
  as: "answers",
  onDelete: "CASCADE",
});

Candidate.hasMany(ReasonSaveAnswer, {
  foreignKey: "candidateId",
  as: "reasons",
  onDelete: "CASCADE",
});

ReasonSaveAnswer.belongsTo(ReasonAnswer, {
  foreignKey: "answer",
  onDelete: "CASCADE",
  
});

ReasonAnswer.hasMany(ReasonSaveAnswer, {
  foreignKey: "answer",
  onDelete: "CASCADE",
 
});



export default ReasonSaveAnswer;
