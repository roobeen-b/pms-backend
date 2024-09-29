import sql from "mssql";
import { config } from "./config";

export const connectDB = async () => {
  sql.connect(config, (err) => {
    if (err) {
      throw err;
    }
    console.log("Connection Successful!");
  });
};
