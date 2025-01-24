// import {DataTypes, Model, Optional} from "sequelize";
// import sequelize from "../../dbconfig/dbconfig";
// interface SecurityQuestionAttributes {
//   id: number;
//   Question: string;
//   Answer: String;
// }

// interface SecurityQuestionCreateAttributes
//   extends Optional<SecurityQuestionAttributes, "id"> {}

// class SecurityQuestion
//   extends Model<SecurityQuestionAttributes, SecurityQuestionCreateAttributes>
//   implements SecurityQuestionAttributes
// {
//   public id!: number;
//   public Question!: string;
//   public Answer!: String;
// }

// SecurityQuestion.init(
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     Question: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     Answer: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//   },
//   {
//     tableName: "SecurityQuestion",
//     sequelize,
//     timestamps: true,
//   }
// );

// export default SecurityQuestion;
