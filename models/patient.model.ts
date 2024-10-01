export type Gender = "male" | "female" | "other";
export interface PatientModel {
  userId: string;
  birthDate: Date;
  gender: Gender;
  address: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  primaryPhysician: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  allergies?: string | undefined;
  currentMedication?: string | undefined;
  familyMedicalHistory?: string | undefined;
  pastMedicalHistory?: string | undefined;
  identificationType?: string | undefined;
  identificationNumber?: string | undefined;
  identificationDocumentId?: string | undefined;
  identificationDocumentUrl?: string | undefined;
  identificationDocument?: FormData | undefined;
  privacyConsent: number;
  treatmentConsent: number;
  disclosureConsent: number;
  createdDate: Date;
}
export interface UpdatePatientModel {
  userId: string;
  birthDate: Date;
  gender: Gender;
  address: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  primaryPhysician: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  allergies?: string | undefined;
  currentMedication?: string | undefined;
  familyMedicalHistory?: string | undefined;
  pastMedicalHistory?: string | undefined;
  identificationType?: string | undefined;
  identificationNumber?: string | undefined;
  identificationDocumentId?: string | undefined;
  identificationDocumentUrl?: string | undefined;
  identificationDocument?: FormData | undefined;
  updatedDate: Date;
}
