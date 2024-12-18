import { Pool } from "pg";
import { config } from "../db/config";
import { UpdateUserModel } from "../models/user.model";

class UserService {
  static pool = new Pool(config);

  static async updateUserInfo(userData: UpdateUserModel) {
    const client = await this.pool.connect();
    try {
      const setClause = Object.keys(userData)
        .map((key, idx) => `${key} = $${idx + 1}`)
        .join(", ");
      const updateQuery = `UPDATE users SET ${setClause} WHERE userId = $${
        Object.keys(userData).length + 1
      }`;
      const valuesArray = [...Object.values(userData), userData.userId];

      const result = await client.query(updateQuery, valuesArray);
      return result.rows && result.rows.length ? result.rows[0] : null;
    } catch (error) {
      console.log(error);
      throw new Error("Error updating user: " + (error as Error).message);
    } finally {
      client.release();
    }
  }
}

export default UserService;
