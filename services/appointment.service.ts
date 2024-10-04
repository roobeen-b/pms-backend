import * as sql from "mssql";
import { config } from "../db/config";
import { CreateAppointmentModel } from "../models/appointment.model";

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

      return request.query(query, (err: Error | undefined, result: any) => {
        if (err) {
          throw new Error(err.message);
        } else {
          return result.recordset && result.recordset.length
            ? result.recordset[0]
            : null;
        }
      });
    } catch (error) {
      throw new Error(
        `Error creating appointment: ${(error as Error).message}`
      );
    }
  }

  static async getAllAppointmentsByUser(userId: string) {
    try {
      const pool = await this.poolPromise;
      const query = `SELECT * FROM appointments WHERE userId = @userId`;
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
      const query = "SELECT * FROM appointments";
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
