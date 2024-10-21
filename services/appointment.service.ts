import * as sql from "mssql";
import { config } from "../db/config";
import {
  CreateAppointmentModel,
  UpdateAppointmentModel,
} from "../models/appointment.model";

class AppointmentService {
  static poolPromise = new sql.ConnectionPool(config).connect();

  static async createAppointment(appointmentData: CreateAppointmentModel) {
    try {
      const pool = await this.poolPromise;
      const columns = Object.keys(appointmentData).join(", ");
      const values = Object.keys(appointmentData)
        .map((data) => `@${data}`)
        .join(", ");
      const query = `INSERT INTO appointments (${columns}) VALUES (${values})`;
      const request = pool.request();
      Object.keys(appointmentData).forEach((key) => {
        request.input(key, (appointmentData as any)[key]);
      });

      const result = await request.query(query);
      return result.recordset && result.recordset.length
        ? result.recordset[0]
        : null;
    } catch (error) {
      throw new Error(
        `Error creating appointment: ${(error as Error).message}`
      );
    }
  }

  static async updateAppointment(appointmentData: UpdateAppointmentModel) {
    try {
      const pool = await this.poolPromise;
      const setClause = Object.keys(appointmentData)
        .map((key) => `${key} = @${key}`)
        .join(", ");

      const query = `UPDATE appointments 
        SET ${setClause}
         WHERE appointmentId=@appointmentId`;

      const request = pool.request();
      Object.keys(appointmentData).forEach((key) => {
        request.input(key, (appointmentData as any)[key]);
      });

      const result = await request.query(query);
      return result.recordset && result.recordset.length
        ? result.recordset[0]
        : null;
    } catch (error) {
      throw new Error(
        `Error updating appointment: ${(error as Error).message}`
      );
    }
  }

  static async getAllAppointmentsByUser(userId: string) {
    try {
      const pool = await this.poolPromise;
      const query = `SELECT fullname, phone, email, a.* 
      FROM appointments as a JOIN users as u 
      ON a.userId = u.userId
      WHERE a.userId = @userId
      ORDER BY a.schedule`;
      const result = await pool.request().input("userId", userId).query(query);
      return result.recordset && result.recordset.length
        ? result.recordset
        : null;
    } catch (error) {
      throw new Error(
        `Error fetching appointments: ${(error as Error).message}`
      );
    }
  }

  static async getAllAppointments() {
    try {
      const pool = await this.poolPromise;
      const query = `SELECT fullname, phone, email, a.* 
      FROM appointments as a JOIN users as u 
      ON a.userId = u.userId
      ORDER BY a.schedule`;
      const result = await pool.request().query(query);
      return result.recordset && result.recordset.length
        ? result.recordset
        : null;
    } catch (error) {
      throw new Error(
        `Error fetching appointments: ${(error as Error).message}`
      );
    }
  }
}

export default AppointmentService;
