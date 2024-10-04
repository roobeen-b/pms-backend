import { config } from "../db/config";
import * as sql from "mssql";
import { PatientModel, UpdatePatientModel } from "../models/patient.model";

class PatientService {
  static poolPromise = new sql.ConnectionPool(config).connect();

  static async registerPatientInfo(patientData: PatientModel) {
    try {
      const pool = await PatientService.poolPromise;
      const columns = Object.keys(patientData).join(", ");
      const values = Object.keys(patientData)
        .map((key) => `@${key}`)
        .join(", ");
      const query = `INSERT INTO patients (${columns}) VALUES (${values})`;

      const request = pool.request();
      Object.keys(patientData).forEach((key) => {
        request.input(key, (patientData as any)[key]);
      });

      request.query(query, (err: Error | undefined, result: any) => {
        if (err) {
          throw new Error(err.message);
        } else {
          return result.recordset && result.recordset.length
            ? result.recordset[0]
            : null;
        }
      });
    } catch (error) {
      throw new Error("Error registering patient: " + (error as Error).message);
    }
  }

  static async updatePatientInfo(patientData: UpdatePatientModel) {
    try {
      const pool = await PatientService.poolPromise;

      const setClause = Object.keys(patientData)
        .map((key) => `${key} = @${key}`)
        .join(", ");

      const query = `UPDATE patients 
        SET ${setClause}
         WHERE userId=@userId`;

      const request = pool.request();
      Object.keys(patientData).forEach((key) => {
        request.input(key, (patientData as any)[key]);
      });

      request.query(query, (err: Error | undefined, result: any) => {
        if (err) {
          throw new Error(err.message);
        } else {
          return result.recordset && result.recordset.length
            ? result.recordset[0]
            : null;
        }
      });
    } catch (error) {
      throw new Error("Error registering patient: " + (error as Error).message);
    }
  }

  static async getPatientInfo(userId: string) {
    try {
      const pool = await this.poolPromise;
      const query = `SELECT patients.*, users.fullname, users.phone, users.email
         FROM patients JOIN users
         ON patients.userId = users.userId
         WHERE patients.userId = @userId`;

      const result = await pool.request().input("userId", userId).query(query);

      return result.recordset && result.recordset.length
        ? result.recordset[0]
        : null;
    } catch (error) {
      throw new Error(
        `Error fetching patient info: ${(error as Error).message}`
      );
    }
  }
}

export default PatientService;
