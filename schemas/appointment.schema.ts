export const appointmentSchema: string = `
CREATE TABLE IF NOT EXISTS appointments (
    appointmentId VARCHAR(255) PRIMARY KEY,
    schedule TIMESTAMP NOT NULL,
    reason VARCHAR(255) NOT NULL,
    note VARCHAR(255),
    primaryPhysician VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL,
    cancellationReason VARCHAR(255),
    userId VARCHAR(255),
    createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_status CHECK (status IN ('scheduled', 'cancelled', 'pending')),
    CONSTRAINT fk_user FOREIGN KEY (userId) REFERENCES patients(userId)
);
`;
