interface Config {
  server: string;
  user: string;
  password: string;
  database: string;
  options: object;
}

export const config: Config = {
  server: process.env.DB_SERVER || "DESKTOP-KRG83NC\\SQLEXPRESS",
  user: process.env.DB_USER || "sa",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_DATABASE || "PatientManagementSystemDB",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};
