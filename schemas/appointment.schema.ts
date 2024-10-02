export const appointmentSchema: string = `
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='appointments' AND xtype='U')
BEGIN
    CREATE TABLE appointments (
    appointmentId VARCHAR(255) PRIMARY KEY,
    schedule DATETIME NOT NULL,
    reason VARCHAR(255) NOT NULL,
    note VARCHAR(255),
    primaryPhysician VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL,
    cancellationReason VARCHAR(255),
    userId VARCHAR(255),
    createdDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_status CHECK (status IN ('scheduled', 'cancelled', 'pending')),
    CONSTRAINT fk_user FOREIGN KEY (userId) REFERENCES patients(userId)
);

END
`;
