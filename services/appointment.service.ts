import * as sql from "mssql";
import { config } from "../db/config";
import {
  CreateAppointmentModel,
  UpdateAppointmentModel,
} from "../models/appointment.model";

interface AppointmentCounts {
  allAppointments: number;
  pendingAppointments: number;
  scheduledAppointments: number;
  cancelledAppointments: number;
}

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
      FROM appointments AS a JOIN users AS u 
      ON a.userId = u.userId
      WHERE a.userId = @userId
      ORDER BY a.schedule`;
      const result = await pool.request().input("userId", userId).query(query);
      return result.recordset && result.recordset.length
        ? result.recordset
        : [];
    } catch (error) {
      throw new Error(
        `Error fetching appointments: ${(error as Error).message}`
      );
    }
  }

  static async getAllAppointmentsByDoctor(doctorId: string) {
    try {
      const pool = await this.poolPromise;
      const query = `SELECT fullname, phone, email, a.* 
      FROM appointments AS a
      JOIN users AS u 
      ON a.userId = u.userId
      WHERE a.doctorId = @doctorId
      ORDER BY a.schedule`;
      const result = await pool
        .request()
        .input("doctorId", doctorId)
        .query(query);
      return result.recordset && result.recordset.length
        ? result.recordset
        : [];
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
        : [];
    } catch (error) {
      throw new Error(
        `Error fetching appointments: ${(error as Error).message}`
      );
    }
  }

  static async getAllAppointmentsCount(role: string, id: string) {
    try {
      const pool = await this.poolPromise;
      let query, result;
      if (role === "admin") {
        query = `SELECT * FROM appointments`;
        result = await pool.request().query(query!);
      } else if (role === "doctor") {
        query = `SELECT * 
                  FROM appointments AS a
                  WHERE a.doctorId = @doctorId
                  `;
        result = await pool.request().input("doctorId", id).query(query!);
      } else {
        query = `SELECT * 
                  FROM appointments AS a
                  WHERE a.userId = @userId
                  `;
        result = await pool.request().input("userId", id).query(query!);
      }
      const allAppointments = result?.recordset.length && result.recordset;

      const initialCounts: AppointmentCounts = {
        allAppointments: 0,
        pendingAppointments: 0,
        scheduledAppointments: 0,
        cancelledAppointments: 0,
      };

      const appointmentCounts = (
        allAppointments as CreateAppointmentModel[]
      )?.reduce((acc: AppointmentCounts, curr: CreateAppointmentModel) => {
        if (curr.status === "pending") {
          acc.pendingAppointments += 1;
        } else if (curr.status === "scheduled") {
          acc.scheduledAppointments += 1;
        } else if (curr.status === "cancelled") {
          acc.cancelledAppointments += 1;
        }
        acc.allAppointments += 1;
        return acc;
      }, initialCounts);

      return appointmentCounts;
    } catch (error) {
      throw new Error(
        `Error fetching appointments count: ${(error as Error).message}`
      );
    }
  }

  static async deleteAppointment(appointmentId: string) {
    try {
      const pool = await this.poolPromise;
      const query = `DELETE FROM appointments WHERE appointmentId = @appointmentId`;
      const result = await pool
        .request()
        .input("appointmentId", appointmentId)
        .query(query);
      return result && result.recordset && result.recordset[0];
    } catch (error) {
      throw new Error(
        `Error deleting appointments count: ${(error as Error).message}`
      );
    }
  }
}

export default AppointmentService;
