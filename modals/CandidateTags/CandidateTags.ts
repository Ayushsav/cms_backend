import {Model, DataTypes, Optional} from "sequelize";
import sequelize from "../../dbconfig/dbconfig";
import Candidate from "../Candidate/Candidate";
import Tag from "../Tag/Tag";

interface CandidateAttributes {
  candidateId: number;
  tagId: number;
}
interface CandidateCreationAttributes
  extends Optional<CandidateAttributes, "candidateId"> {}
class CandidateTags
  extends Model<CandidateAttributes, CandidateCreationAttributes>
  implements CandidateAttributes
{
  public candidateId!: number;
  public tagId!: number;
}

CandidateTags.init(
  {
    candidateId: {
      type: DataTypes.INTEGER,
      references: {
        model: Candidate,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    tagId: {
      type: DataTypes.INTEGER,
      references: {
        model: Tag,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  {
    tableName: "candidate_tags",
    sequelize,
  }
);

// Candidate - Tag (Many-to-Many)
Candidate.belongsToMany(Tag, {
  through: CandidateTags,
  foreignKey: "candidateId",
  otherKey: "tagId",
  as: "tags",
});
Tag.belongsToMany(Candidate, {
  through: CandidateTags,
  foreignKey: "tagId",
  otherKey: "candidateId",
  as: "candidates",
});
export default CandidateTags;
