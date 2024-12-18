import { Pool } from "pg";
import { config } from "../db/config";
import { PatientModel, UpdatePatientModel } from "../models/patient.model";

class PatientService {
  static pool = new Pool(config);

  static async registerPatientInfo(patientData: PatientModel) {
    const client = await this.pool.connect();
    try {
      const columns = Object.keys(patientData).join(", ");
      const values = Object.keys(patientData)
        .map((_, idx) => `$${idx + 1}`)
        .join(", ");
      const query = `INSERT INTO patients (${columns}) VALUES (${values}) RETURNING *`;
      const valuesArray = Object.values(patientData);

      const result = await client.query(query, valuesArray);
      return result.rows && result.rows.length ? result.rows[0] : null;
    } catch (error) {
      throw new Error("Error registering patient: " + (error as Error).message);
    } finally {
      client.release();
    }
  }

  static async updatePatientInfo(patientData: UpdatePatientModel) {
    const client = await this.pool.connect();
    try {
      const setClause = Object.keys(patientData)
        .map((key, idx) => `${key} = $${idx + 1}`)
        .join(", ");
      const query = `UPDATE patients 
        SET ${setClause}
        WHERE userId = $${Object.keys(patientData).length + 1}`;
      const valuesArray = [...Object.values(patientData), patientData.userId];

      const result = await client.query(query, valuesArray);
      return result.rows && result.rows.length ? result.rows[0] : null;
    } catch (error) {
      throw new Error("Error updating patient: " + (error as Error).message);
    } finally {
      client.release();
    }
  }

  static async getPatientInfo(patientId: string) {
    const client = await this.pool.connect();
    try {
      const query = `SELECT patients.*, users.fullname, users.phone, users.email
                     FROM patients 
                     JOIN users ON patients."userId" = users."userId"
                     WHERE patients."userId" = $1`;
      const result = await client.query(query, [patientId]);

      return result.rows && result.rows.length ? result.rows[0] : null;
    } catch (error) {
      throw new Error(
        `Error fetching patient info: ${(error as Error).message}`
      );
    } finally {
      client.release();
    }
  }

  static async getAllPatients() {
    const client = await this.pool.connect();
    try {
      const query = `SELECT patients.*, users.fullname, users.phone, users.email
                     FROM patients 
                     JOIN users ON patients."userId" = users."userId"
                     WHERE users.role = 'user'`;
      const result = await client.query(query);

      return result.rows && result.rows.length ? result.rows : [];
    } catch (error) {
      throw new Error(`Error fetching patients: ${(error as Error).message}`);
    } finally {
      client.release();
    }
  }

  static async getAllPatientsCount() {
    const client = await this.pool.connect();
    try {
      const query = `SELECT COUNT(*) as patientCount FROM patients`;
      const result = await client.query(query);
      return result.rows[0].patientcount;
    } catch (error) {
      throw new Error(
        `Error fetching patients count: ${(error as Error).message}`
      );
    } finally {
      client.release();
    }
  }

  static async deletePatient(patientId: string) {
    const client = await this.pool.connect();
    try {
      const query = `DELETE FROM patients WHERE userId = $1 RETURNING *`;
      const result = await client.query(query, [patientId]);
      return result.rows && result.rows.length ? result.rows[0] : null;
    } catch (error) {
      throw new Error(`Error deleting patient: ${(error as Error).message}`);
    } finally {
      client.release();
    }
  }
}

export default PatientService;
