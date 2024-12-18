export const doctorSchema: string = `
CREATE TABLE IF NOT EXISTS doctors (
    doctorId VARCHAR(255) PRIMARY KEY,
    docLicenseNo VARCHAR(50),
    specialties INT,
    doctorPhoto VARCHAR(255),
    createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_doctor_user FOREIGN KEY (doctorId) REFERENCES users(userId),
    CONSTRAINT fk_doctor_specialty FOREIGN KEY (specialties) REFERENCES specialties(id)
);
`;
