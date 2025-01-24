// src/models/WorkExperience.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../../dbconfig/dbconfig';
import Candidate from '../Candidate/Candidate';

interface WorkExperienceAttributes {
  id: number;
  candidateId: number;
  years: number;
  currentCtc: number;
}

class WorkExperience extends Model<WorkExperienceAttributes> implements WorkExperienceAttributes {
  public id!: number;
  public candidateId!: number;
  public years!: number;
  public currentCtc!: number;
}

WorkExperience.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    candidateId: {
      type: DataTypes.INTEGER,
      references: {
        model: Candidate,
        key: 'id',
      },
      allowNull: false,
    },
    years: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    currentCtc: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    tableName: 'work_experiences',
    sequelize,
  }
);

export default WorkExperience;
