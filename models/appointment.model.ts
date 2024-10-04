export type Status = "pending" | "scheduled" | "cancelled";
export interface CreateAppointmentModel {
  appointmentId: string;
  schedule: Date;
  reason: string;
  note?: string;
  primaryPhysician: string;
  status: Status;
  cancellationReason?: string;
  userId: string;
}
