import * as sql from "mssql";
import { config } from "../db/config";

class SpecialtyService {
  static poolPromise = new sql.ConnectionPool(config).connect();

  static async getAllSpecialties() {
    const pool = await this.poolPromise;

    try {
      const request = pool.request();

      const query = "SELECT * FROM specialties ORDER BY sname";

      const result = await request.query(query);
      return result.recordset && result.recordset.length
        ? result.recordset
        : null;
    } catch (error) {
      throw new Error(
        `Error fetching specialties: ${(error as Error).message}`
      );
    }
  }
}

export default SpecialtyService;
