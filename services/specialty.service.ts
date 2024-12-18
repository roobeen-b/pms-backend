import { Pool } from "pg";
import { config } from "../db/config";

class SpecialtyService {
  static pool = new Pool(config);

  static async getAllSpecialties() {
    const client = await this.pool.connect();

    try {
      const query = "SELECT * FROM specialties ORDER BY sname";
      const result = await client.query(query);
      return result.rows.length ? result.rows : null;
    } catch (error) {
      throw new Error(
        `Error fetching specialties: ${(error as Error).message}`
      );
    } finally {
      client.release(); // Release the client back to the pool
    }
  }
}

export default SpecialtyService;
