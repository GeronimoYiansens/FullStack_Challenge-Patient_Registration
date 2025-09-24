export interface Patient {
    id: number;
    fullName: string;
    email: string;
    phoneCountryCode: string;
    phoneNumber: string;
    hasPhoto?: boolean;
  }
  
  export interface CreatePatientRequest {
    fullName: string;
    email: string;
    phoneCountryCode: string;
    phoneNumber: string;
    documentPhoto: File;
  }
  
  export interface PatientResponse {
    success: boolean;
    patient?: Patient;
    error?: string;
    message?: string;
  }
  
  export interface PatientsListResponse {
    success: boolean;
    patients?: Patient[];
    error?: string;
  }
  
  export enum CountryCode {
    URUGUAY = '+598',
    ARGENTINA = '+54',
    BRAZIL = '+55',
    CHILE = '+56',
    USA = '+1',
    SPAIN = '+34'
  }