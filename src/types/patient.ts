export interface Patient {
    id: number;
    fullName: string;
    email: string;
    phoneCountryCode: string;
    phoneNumber: string;
    documentPhotoPath?: string;
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
}

export interface PatientsListResponse {
    success: boolean;
    patients?: Patient[];
    error?: string;
}
