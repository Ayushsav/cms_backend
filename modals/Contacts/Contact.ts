// src/models/Contact.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../../dbconfig/dbconfig';
import Candidate from '../Candidate/Candidate';

interface ContactAttributes {
  id: number;
  candidateId: number;
  phoneNumber: string;
}

class Contact extends Model<ContactAttributes> implements ContactAttributes {
  public id!: number;
  public candidateId!: number;
  public phoneNumber!: string;
}

Contact.init(
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
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'contacts',
    sequelize,
  }
);

export default Contact;
