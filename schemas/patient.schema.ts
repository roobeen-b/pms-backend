export const patientSchema: string = `
CREATE TABLE IF NOT EXISTS patients (
    userId VARCHAR(255) PRIMARY KEY,
    gender VARCHAR(255),
    birthDate TIMESTAMP,
    address VARCHAR(255),
    occupation VARCHAR(255),
    emergencyContactName VARCHAR(255),
    emergencyContactNumber VARCHAR(255),
    insuranceProvider VARCHAR(255),
    insurancePolicyNumber VARCHAR(255),
    allergies VARCHAR(255),
    currentMedication VARCHAR(255),
    familyMedicalHistory VARCHAR(255),
    pastMedicalHistory VARCHAR(255),
    identificationType VARCHAR(255),
    identificationNumber VARCHAR(255),
    identificationDocumentId VARCHAR(255),
    identificationDocumentUrl VARCHAR(255),
    primaryPhysician VARCHAR(255),
    privacyConsent BOOLEAN NOT NULL,
    treatmentConsent BOOLEAN NOT NULL,
    disclosureConsent BOOLEAN NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(userId)
);
`;
