export const userSchema: string = `
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' AND xtype='U')
BEGIN
    CREATE TABLE users (
        userId VARCHAR(255) UNIQUE NOT NULL,
        fullname VARCHAR(255) NOT NULL,
        phone VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255),
        PRIMARY KEY (userId)
    )
END

`;
