import { Sequelize, DataTypes, Model } from '@sequelize/core';
import { PostgresDialect } from '@sequelize/postgres';

const sequelize = new Sequelize({
  dialect: PostgresDialect,
  database: 'patient_management',
  user: 'postgres',
  password: 'postgres123',
  host: 'database',
  port: 5432,
  logging: console.log
});

class PatientModel extends Model {
  public id!: number;
  public fullName!: string;
  public email!: string;
  public phoneCountryCode!: string;
  public phoneNumber!: string;
  public documentPhotoPath?: string;
}

PatientModel.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  phoneCountryCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  documentPhotoPath: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  sequelize,
  modelName: 'Patient',
  tableName: 'patients',
  timestamps: false,
});

sequelize.sync();

export async function createPatient(data: {
  fullName: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  documentPhotoPath?: string;
}) {
  const patient = await PatientModel.create(data);
  return patient.toJSON();
}

export async function getPatients() {
  const patients = await PatientModel.findAll();
  return patients.map(p => p.toJSON());
}