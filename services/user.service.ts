import { UpdateUserModel } from "../models/user.model";
import * as sql from "mssql";
import { config } from "../db/config";

class UserService {
  static poolPromise = new sql.ConnectionPool(config).connect();

  static async updateUserInfo(userData: UpdateUserModel) {
    try {
      const poolPromise = await this.poolPromise;
      const setClause = Object.keys(userData)
        .map((key) => `${key} = @${key}`)
        .join(", ");
      const updateQuery = `UPDATE users SET ${setClause} WHERE userId = @userId`;
      const request = poolPromise.request();
      Object.keys(userData).forEach((key) => {
        request.input(key, (userData as any)[key]);
      });

      const result = await request.query(updateQuery);
      return result.recordset && result.recordset.length
        ? result.recordset[0]
        : null;
    } catch (error) {
      console.log(error);
      throw new Error("Error updating user: " + (error as Error).message);
    }
  }
}

export default UserService;
