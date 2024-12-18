export const userSchema: string = `
CREATE TABLE IF NOT EXISTS users (
    userId VARCHAR(255) UNIQUE NOT NULL,
    fullname VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL CHECK (role IN ('admin', 'user', 'doctor')),
    PRIMARY KEY (userId)
);
`;
