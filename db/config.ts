interface Config {
  user: string;
  host: string;
  database: string;
  password: string;
  port: number;
}

export const config: Config = {
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_DATABASE || "PatientManagementSystemDB",
  password: process.env.DB_PASSWORD || "password",
  port: parseInt(process.env.DB_PORT!, 10) || 5432,
};
