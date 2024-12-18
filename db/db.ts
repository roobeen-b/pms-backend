import { Pool } from "pg";
import { config } from "./config";

export const connectDB = async () => {
  const pool = new Pool(config);

  pool.connect((err, client, release) => {
    if (err) {
      throw err;
    }
    console.log("Connection Successful!");
    release(); // Release the client back to the pool
  });
};
