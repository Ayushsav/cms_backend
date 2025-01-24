// import {Model, DataTypes, Optional} from "sequelize";
// import sequelize from "../../dbconfig/dbconfig";
// import Candidate from "../Candidate/Candidate";
// import ReasonsForLeaving from "../ReasonForLeaving/ReasonForLeaving";

// interface CandidateAttributes {
//   candidateId: number;
//   reasonId: number;
//   order: number;
//   createdAt: Date;
//   updatedAt: Date;
// }
// interface CandidateCreationAttributes
//   extends Optional<CandidateAttributes, "candidateId"> {}

// class CandidateReasons
//   extends Model<CandidateAttributes, CandidateCreationAttributes>
//   implements CandidateAttributes
// {
//   public candidateId!: number;
//   public reasonId!: number;
//   public order!: number;
//   public createdAt!: Date;
//   public updatedAt!: Date;
// }

// CandidateReasons.init(
//   {
//     candidateId: {
//       type: DataTypes.INTEGER,
//       references: {
//         model: Candidate,
//         key: "id",
//       },
//       onDelete: "CASCADE",
//       onUpdate: "CASCADE",
//     },
//     reasonId: {
//       type: DataTypes.INTEGER,
//       references: {
//         model: ReasonsForLeaving,
//         key: "id",
//       },
//       onDelete: "CASCADE",
//       onUpdate: "CASCADE",
//     },
//     order: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       defaultValue: 0,
//     },
//     createdAt: {
//       type: DataTypes.DATE,
//       allowNull: false,
//       defaultValue: new Date(),
//     },
//     updatedAt: {
//       type: DataTypes.DATE,
//       allowNull: false,
//       defaultValue: new Date(),
//     },
//   },
//   {
//     tableName: "candidate_reasons",
//     sequelize,
//   }
// );

// // Candidate - ReasonsForLeaving (Many-to-Many)
// Candidate.belongsToMany(ReasonsForLeaving, {
//   through: CandidateReasons,
//   foreignKey: "candidateId",
//   otherKey: "reasonId",
//   as: "reasons",
// });
// ReasonsForLeaving.belongsToMany(Candidate, {
//   through: CandidateReasons,
//   foreignKey: "reasonId",
//   otherKey: "candidateId",
//   as: "candidates",
// });
// export default CandidateReasons;
