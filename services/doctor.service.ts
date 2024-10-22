import * as sql from "mssql";
import { config } from "../db/config";
import { DoctorModel } from "../models/doctor.model";

class DoctorService {
  static poolPromise = new sql.ConnectionPool(config).connect();

  static async registerDoctorInfo(doctorInfo: DoctorModel) {
    const pool = await this.poolPromise;

    try {
      const columns = Object.keys(doctorInfo).join(", ");
      const values = Object.keys(doctorInfo)
        .map((key) => {
          return `@${key}`;
        })
        .join(", ");

      const query = `INSERT INTO doctors (${columns}) VALUES (${values})`;
      const request = pool.request();

      Object.keys(doctorInfo).forEach((key) => {
        request.input(key, (doctorInfo as any)[key]);
      });

      const result = await request.query(query);
      return result.recordset && result.recordset.length
        ? result.recordset[0]
        : null;
    } catch (error) {
      throw new Error(`Error registering doctor: ${(error as Error).message}`);
    }
  }
}

export default DoctorService;
