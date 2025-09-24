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
  public documentPhoto?: Buffer;
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
  documentPhoto: {
    type: DataTypes.BLOB,
    allowNull: true,
  }
}, {
  sequelize,
  modelName: 'Patient',
  tableName: 'patients',
  timestamps: false,
});

// Initialize the database connection and synchronize models once at startup.
export const dbReady: Promise<void> = (async () => {
  await sequelize.authenticate();
  await sequelize.sync();
})();

export async function createPatient(data: {
  fullName: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  documentPhoto?: Buffer;
}) {
  const patient = await PatientModel.create(data);
  const result = patient.toJSON();
  if (result.documentPhoto) {
    result.hasPhoto = true;
    delete result.documentPhoto;
  }
  return result;
}

export async function getPatients() {
  const patients = await PatientModel.findAll({
    attributes: ['id', 'fullName', 'email', 'phoneCountryCode', 'phoneNumber', 'documentPhoto']
  });
  return patients.map(p => {
    const result: any = p.toJSON();
    result.hasPhoto = !!result.documentPhoto;
    delete result.documentPhoto;
    return result;
  });
}

export async function getPatientPhoto(id: number) {
  const patient = await PatientModel.findByPk(id, {
    attributes: ['documentPhoto']
  });
  
  if (!patient || !patient.documentPhoto) {
    return null;
  }
  
  return {
    photo: patient.documentPhoto,
    type: 'image/jpeg'
  };
}