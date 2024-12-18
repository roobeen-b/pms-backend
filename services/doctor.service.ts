import { Pool } from "pg";
import { config } from "../db/config";
import { DoctorModel } from "../models/doctor.model";

class DoctorService {
  static pool = new Pool(config);

  static async registerDoctorInfo(doctorInfo: DoctorModel) {
    const client = await this.pool.connect();
    try {
      const columns = Object.keys(doctorInfo).join(", ");
      const values = Object.keys(doctorInfo)
        .map((_, idx) => `$${idx + 1}`)
        .join(", ");
      const query = `INSERT INTO doctors (${columns}) VALUES (${values}) RETURNING *`;
      const valuesArray = Object.values(doctorInfo);

      const result = await client.query(query, valuesArray);
      return result.rows && result.rows.length ? result.rows[0] : null;
    } catch (error) {
      throw new Error(`Error registering doctor: ${(error as Error).message}`);
    } finally {
      client.release();
    }
  }

  static async getAllDoctors() {
    const client = await this.pool.connect();
    try {
      const query = `SELECT d.*, u.fullname, u.phone, u.email, s.sname as specialty
                     FROM doctors as d
                     JOIN users as u ON d."doctorId" = u."userId"
                     JOIN specialties s ON d.specialties = s.id`;
      const result = await client.query(query);
      return result.rows.length ? result.rows : null;
    } catch (error) {
      throw new Error(`Error fetching doctors: ${(error as Error).message}`);
    } finally {
      client.release();
    }
  }

  static async getDoctorById(doctorId: string) {
    const client = await this.pool.connect();
    try {
      const query = `SELECT d.*, u.fullname, u.phone, u.email, s.sname as specialty
                     FROM doctors as d
                     JOIN users as u ON d."doctorId" = u."userId"
                     JOIN specialties s ON d.specialties = s."id"
                     WHERE d."doctorId" = $1`;
      const result = await client.query(query, [doctorId]);
      return result.rows.length ? result.rows[0] : null;
    } catch (error) {
      throw new Error(`Error fetching doctor: ${(error as Error).message}`);
    } finally {
      client.release();
    }
  }

  static async getAllDoctorsCount() {
    const client = await this.pool.connect();
    try {
      const query = `SELECT COUNT(*) as doctorCount FROM doctors`;
      const result = await client.query(query);
      return result.rows[0].doctorcount;
    } catch (error) {
      throw new Error(
        `Error fetching doctors count: ${(error as Error).message}`
      );
    } finally {
      client.release();
    }
  }

  static async deleteDoctor(doctorId: string) {
    const client = await this.pool.connect();
    try {
      const query = `DELETE FROM doctors WHERE doctorId = $1 RETURNING *`;
      const result = await client.query(query, [doctorId]);
      return result.rows.length ? result.rows[0] : null;
    } catch (error) {
      throw new Error(`Error deleting doctor: ${(error as Error).message}`);
    } finally {
      client.release();
    }
  }
}

export default DoctorService;
