export const doctorSchema: string = `
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='doctors' AND xtype='U')
BEGIN
    CREATE TABLE doctors (
        doctorId varchar(255) primary key,
        docLicenseNo varchar(50),
        specialties int,
        doctorPhoto varchar(255),
        createdDate DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
        constraint fk_doctor_user foreign key (doctorId) references users(userId),
        constraint fk_doctor_specialty foreign key (specialties) references specialties(id)
    )
END
`;
