import {Model, DataType, Optional, DataTypes} from "sequelize";
import sequelize from "../../dbconfig/dbconfig";
import User from "../User/User";

interface ProductAttributes {
  id: number;
  Candidate_Name: string;
  Resume_Title: string;
  Contact_Number: string;
  Email: string;
  Work_Exp: string;
  Current_Ctc: number;
  Salary: string;
  Current_Location: string;
  State: string;
  Region: string;
  UserId : number;
}

interface ProductCreateAttributes extends Optional<ProductAttributes, "id"> {}

class Product
  extends Model<ProductAttributes, ProductCreateAttributes>
  implements ProductAttributes
{
  public id!: number;
  public Candidate_Name!: string;
  public Resume_Title!: string;
  public Contact_Number!: string;
  public Email!: string;
  public Work_Exp!: string;
  public Current_Ctc!: number;
  public Salary!: string;
  public Current_Location!: string;
  public State!: string;
  public Region!: string;
  public UserId!: number;
 
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Candidate_Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Resume_Title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Contact_Number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
          },
    Work_Exp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Current_Ctc: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Salary: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Current_Location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    State: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Region: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    //foreign key

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
    
  },
  {
    tableName: "Product",
    sequelize,
  }
);

export default Product;