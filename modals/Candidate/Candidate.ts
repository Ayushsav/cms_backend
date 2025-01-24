import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../../dbconfig/dbconfig";
import User from "../User/User";
import Designation from "../Designation/Designation";
import Region from "../Region/Region";



interface CandidateAttributes {
  id: number;
  name: string;
  resumeTitle: string;
  contactNumber: string;
  whatsappNumber: string;
  email: string;
  workExp: string;
  currentCTC: string;
  currentLocation: string;
  currentEmployeer: string;
  postalAddress: string;
  lastActive: Date;
  state: string;
  preferredLocation: string;
  dob: Date;
  remarks: string;
  UserId: number;
  designationId: number;
  country: string;
  city: string;
  lastReminderSent?: Date;

  
}

interface CandidateCreationAttributes
  extends Optional<CandidateAttributes, "id"> {}

class Candidate
  extends Model<CandidateAttributes, CandidateCreationAttributes>
  implements CandidateAttributes
{
  public id!: number;
  public name!: string;
  public resumeTitle!: string;
  public contactNumber!: string;
  public whatsappNumber!: string;
  public email!: string;
  public workExp!: string;
  public currentCTC!: string;
  public currentLocation!: string;
  public postalAddress!: string;
  public lastActive!: Date;
  public state!: string;
  public preferredLocation!: string;
  public dob!: Date;
  public designationId!: number;
  public UserId!: number;
  public currentEmployeer!: string;
  public remarks!: string;
  // public regionId!: number;
  // public region!: string;
  public country!: string;
  public city!: string;
  public lastReminderSent!: Date;

}

Candidate.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resumeTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contactNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    whatsappNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    workExp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    currentCTC: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    currentLocation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    currentEmployeer:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    postalAddress:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastActive:{
      type: DataTypes.DATE,
      allowNull: true,
    },
    preferredLocation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: true,
    },
   
    remarks: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    UserId: {
      type: DataTypes.BIGINT,
      references: {
        // This is a reference to another model
        model: User,
        // This is the column name of the referenced model
        key: 'id',
      },
      allowNull: false,
    },
    designationId: {
      type: DataTypes.INTEGER,
      
      references: {
        model: Designation,
        key: 'id',
      },
      allowNull: false,
      
    },
   
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    
    lastReminderSent: {
      type: DataTypes.DATE,
      
      defaultValue: new Date(),
    },

    
    
  },
  {
    tableName: "candidates",
    sequelize,
  }
);
// Candidate - User (Many-to-One)
Candidate.belongsTo(User, {
  foreignKey: "UserId",
  as: "user",
  onDelete: "CASCADE",
});
User.hasMany(Candidate, {
  foreignKey: "UserId",
  as: "candidates",
  onDelete: "CASCADE",
});

// // Candidate - Designation (Many-to-One)
Candidate.belongsTo(Designation, {
  foreignKey: "designationId",
  as: "designation",
  onDelete: "CASCADE",
});
Designation.hasMany(Candidate, {
  foreignKey: "designationId",
  as: "candidates",
  onDelete: "CASCADE",
});

// // // // Candidate - Region (Many-to-One)
// Candidate.belongsTo(Region, {
//   foreignKey: "regionId",
//   as: "region"
// });
// Region.hasMany(Candidate, {
//   foreignKey: "regionId",
//   as: "candidates"
// });
export default Candidate;
