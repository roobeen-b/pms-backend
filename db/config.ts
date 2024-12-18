interface Config {
  server: string;
  user: string;
  password: string;
  database: string;
  options: object;
}

export const config: Config = {
  server: process.env.DB_SERVER!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_DATABASE!,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};
