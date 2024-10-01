export const patientSchema: string = `
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='patients' AND xtype='U')
BEGIN
    CREATE TABLE patients (
        userId VARCHAR(255) PRIMARY KEY,
        gender VARCHAR(255),
        birthDate DATETIME,
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
        privacyConsent BIT NOT NULL,
        treatmentConsent BIT NOT NULL,
        disclosureConsent BIT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(userId)
    )
END
`;
