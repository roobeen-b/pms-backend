import { Pool } from "pg";
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
  static pool = new Pool(config);
  static async createAppointment(appointmentData: CreateAppointmentModel) {
    const client = await this.pool.connect();
    try {
      const columns = Object.keys(appointmentData).join(", ");
      const values = Object.keys(appointmentData)
        .map((_, idx) => `$${idx + 1}`)
        .join(", ");
      const query = `INSERT INTO appointments (${columns}) VALUES (${values}) RETURNING *`;
      const valuesArray = Object.values(appointmentData);
      const result = await client.query(query, valuesArray);
      return result.rows && result.rows.length ? result.rows[0] : null;
    } catch (error) {
      throw new Error(
        `Error creating appointment: ${(error as Error).message}`
      );
    } finally {
      client.release();
    }
  }

  static async updateAppointment(appointmentData: UpdateAppointmentModel) {
    const client = await this.pool.connect();
    try {
      const setClause = Object.keys(appointmentData)
        .map((key, idx) => `${key} = $${idx + 1}`)
        .join(", ");
      const values = Object.values(appointmentData);
      const query = `UPDATE appointments SET ${setClause} WHERE appointmentId = $${
        values.length + 1
      }`;
      values.push(appointmentData.appointmentId);
      const result = await client.query(query, values);
      return result.rows && result.rows.length ? result.rows[0] : null;
    } catch (error) {
      throw new Error(
        `Error updating appointment: ${(error as Error).message}`
      );
    } finally {
      client.release();
    }
  }
  static async getAllAppointmentsByUser(userId: string) {
    const client = await this.pool.connect();
    try {
      const query = `SELECT u.fullname, 
    u.phone, 
    u.email, 
    a."appointmentId", 
    a."schedule", 
    a."reason", 
    a."note", 
    a."primaryPhysician", 
    a."status", 
    a."cancellationReason", 
    a."userId", 
    a."createdDate", 
    a."updatedDate", 
    a."doctorId"
     FROM appointments AS a JOIN users AS u ON a."userId" = u."userId" WHERE a."userId" = $1 ORDER BY a.schedule`;
      const result = await client.query(query, [userId]);
      return result.rows;
    } catch (error) {
      throw new Error(
        `Error fetching appointments: ${(error as Error).message}`
      );
    } finally {
      client.release();
    }
  }
  static async getAllAppointmentsByDoctor(doctorId: string) {
    const client = await this.pool.connect();
    try {
      const query = `SELECT u.fullname, 
    u.phone, 
    u.email, 
    a."appointmentId", 
    a."schedule", 
    a."reason", 
    a."note", 
    a."primaryPhysician", 
    a."status", 
    a."cancellationReason", 
    a."userId", 
    a."createdDate", 
    a."updatedDate", 
    a."doctorId" FROM appointments AS a JOIN users AS u ON a."userId" = u."userId" WHERE a."doctorId" = $1 ORDER BY a.schedule`;
      const result = await client.query(query, [doctorId]);
      return result.rows;
    } catch (error) {
      throw new Error(
        `Error fetching appointments: ${(error as Error).message}`
      );
    } finally {
      client.release();
    }
  }
  static async getAllAppointments() {
    const client = await this.pool.connect();
    try {
      const query = `SELECT 
    u.fullname, 
    u.phone, 
    u.email, 
    a."appointmentId", 
    a."schedule", 
    a."reason", 
    a."note", 
    a."primaryPhysician", 
    a."status", 
    a."cancellationReason", 
    a."userId", 
    a."createdDate", 
    a."updatedDate", 
    a."doctorId" 
FROM appointments AS a 
JOIN users AS u ON a."userId" = u."userId" 
ORDER BY a."schedule";
`;
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.log(error);
      throw new Error(
        `Error fetching appointments: ${(error as Error).message}`
      );
    } finally {
      client.release();
    }
  }
  static async getAllAppointmentsCount(role: string, id: string) {
    const client = await this.pool.connect();
    try {
      let query: string, params: any[];
      if (role === "admin") {
        query = `SELECT * FROM appointments`;
        params = [];
      } else if (role === "doctor") {
        query = `SELECT * FROM appointments WHERE "doctorId" = $1`;
        params = [id];
      } else {
        query = `SELECT * FROM appointments WHERE "userId" = $1`;
        params = [id];
      }
      const result = await client.query(query, params);
      const allAppointments = result.rows;
      const initialCounts: AppointmentCounts = {
        allAppointments: 0,
        pendingAppointments: 0,
        scheduledAppointments: 0,
        cancelledAppointments: 0,
      };
      const appointmentCounts = allAppointments.reduce(
        (acc: AppointmentCounts, curr: CreateAppointmentModel) => {
          if (curr.status === "pending") {
            acc.pendingAppointments += 1;
          } else if (curr.status === "scheduled") {
            acc.scheduledAppointments += 1;
          } else if (curr.status === "cancelled") {
            acc.cancelledAppointments += 1;
          }
          acc.allAppointments += 1;
          return acc;
        },
        initialCounts
      );
      return appointmentCounts;
    } catch (error) {
      throw new Error(
        `Error fetching appointments count: ${(error as Error).message}`
      );
    } finally {
      client.release();
    }
  }
  static async deleteAppointment(appointmentId: string) {
    const client = await this.pool.connect();
    try {
      const query = `DELETE FROM appointments WHERE appointmentId = $1 RETURNING *`;
      const result = await client.query(query, [appointmentId]);
      return result.rows && result.rows.length ? result.rows[0] : null;
    } catch (error) {
      throw new Error(
        `Error deleting appointments: ${(error as Error).message}`
      );
    } finally {
      client.release();
    }
  }
}

export default AppointmentService;
