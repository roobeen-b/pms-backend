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

  static async getAllDoctors() {
    try {
      const pool = await this.poolPromise;
      const query = `SELECT d.*, u.fullname, u.phone, u.email, s.sname as specialty
      FROM doctors as d JOIN users as u
       ON d.doctorId = u.userId
       JOIN specialties s
       ON d.specialties = s.id
       `;
      const result = await pool.request().query(query);
      return result.recordset && result.recordset.length
        ? result.recordset
        : null;
    } catch (error) {
      throw new Error(`Error fetching doctors: ${(error as Error).message}`);
    }
  }

  static async getDoctorById(doctorId: string) {
    try {
      const pool = await this.poolPromise;
      const query = `SELECT d.*, u.fullname, u.phone, u.email, s.sname as specialty
      FROM doctors as d JOIN users as u
       ON d.doctorId = u.userId
       JOIN specialties s
       ON d.specialties = s.id
       WHERE d.doctorId = @doctorId
       `;
      const result = await pool
        .request()
        .input("doctorId", doctorId)
        .query(query);
      return result.recordset && result.recordset.length
        ? result.recordset[0]
        : null;
    } catch (error) {
      throw new Error(`Error fetching doctors: ${(error as Error).message}`);
    }
  }

  static async getAllDoctorsCount() {
    try {
      const pool = await this.poolPromise;
      const query = `SELECT COUNT(*) as doctorCount FROM doctors`;
      const result = await pool.request().query(query);
      return result.recordset.length && result.recordset[0].doctorCount;
    } catch (error) {
      throw new Error(
        `Error fetching doctors count: ${(error as Error).message}`
      );
    }
  }

  static async deleteDoctor(doctorId: string) {
    try {
      const pool = await this.poolPromise;
      const query = `DELETE FROM doctors WHERE doctorId = @doctorId`;
      const result = await pool
        .request()
        .input("doctorId", doctorId)
        .query(query);
      return result && result.recordset && result.recordset[0];
    } catch (error) {
      throw new Error(
        `Error deleting appointments count: ${(error as Error).message}`
      );
    }
  }
}

export default DoctorService;
