import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import {
  CreateAppointmentModel,
  UpdateAppointmentModel,
} from "../models/appointment.model";
import AppointmentService from "../services/appointment.service";
import { CustomRequest } from "../custom";
import { checkRecordExists } from "../utils/sqlFunctions";

export const createAppointment = async (req: Request, res: Response) => {
  const {
    schedule,
    reason,
    note,
    primaryPhysician,
    status,
    cancellationReason,
    userId,
    doctorId,
  } = req.body;

  if (!schedule || !reason || !primaryPhysician || !status) {
    res.status(400).json({
      message: "Please fill all the required fields.",
      status: 400,
    });
    return;
  }

  const newAppointment: CreateAppointmentModel = {
    appointmentId: uuidv4(),
    schedule,
    reason,
    note,
    primaryPhysician,
    status,
    cancellationReason,
    userId,
    doctorId,
  };

  try {
    await AppointmentService.createAppointment(newAppointment);
    res.status(201).json({
      message: "Appointment created successfully.",
      status: 201,
    });
  } catch (error) {
    res.status(500).json({
      message: (error as Error).message,
      status: 500,
    });
  }
};

export const updateAppointment = async (req: CustomRequest, res: Response) => {
  const {
    schedule,
    reason,
    note,
    primaryPhysician,
    status,
    cancellationReason,
    userId,
    doctorId,
    appointmentId,
  } = req.body;

  const userRole = req.role;

  if (
    cancellationReason === "" ||
    cancellationReason === null ||
    cancellationReason === undefined
  ) {
    if (userRole !== "admin" && userRole !== "doctor") {
      res.status(403).json({
        message: "You are not authorized to perform this action.",
        status: 403,
      });
      return;
    }
  }

  if (!appointmentId) {
    res.status(400).json({
      message: "Please fill all the required fields.",
      status: 400,
    });
    return;
  }

  if (!schedule || !reason || !primaryPhysician || !status) {
    res.status(400).json({
      message: "Please fill all the required fields.",
      status: 400,
    });
    return;
  }

  const appointment: UpdateAppointmentModel = {
    appointmentId,
    schedule,
    reason,
    note,
    primaryPhysician,
    status,
    cancellationReason,
    userId,
    doctorId,
  };

  try {
    const appointmentExists = await checkRecordExists(
      "appointments",
      "appointmentId",
      appointmentId
    );
    if (appointmentExists) {
      await AppointmentService.updateAppointment(appointment);
      res.status(200).json({
        message: "Appointment updated successfully.",
        status: 200,
      });
    } else {
      res.status(200).json({
        message: "Appointment does not exist",
        status: 200,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: (error as Error).message,
      status: 500,
    });
  }
};

export const getAllAppointmentsByUser = async (
  req: CustomRequest,
  res: Response
) => {
  const userId = req.userId;

  if (!userId) {
    res.status(400).json({
      message: "Please provide user id.",
      status: 400,
    });
    return;
  }
  try {
    const allAppointments = await AppointmentService.getAllAppointmentsByUser(
      userId
    );
    res.status(200).json({
      message: "Successful",
      status: 200,
      data: allAppointments,
    });
  } catch (error) {
    res.status(500).json({
      message: (error as Error).message,
      status: 500,
    });
  }
};

export const getAllAppointmentsByDoctor = async (
  req: CustomRequest,
  res: Response
) => {
  const doctorId = req.userId;

  if (!doctorId) {
    res.status(400).json({
      message: "Please provide doctor id.",
      status: 400,
    });
    return;
  }
  try {
    const allAppointments = await AppointmentService.getAllAppointmentsByDoctor(
      doctorId
    );
    res.status(200).json({
      message: "Successful",
      status: 200,
      data: allAppointments,
    });
  } catch (error) {
    res.status(500).json({
      message: (error as Error).message,
      status: 500,
    });
  }
};

export const getAllAppointments = async (req: Request, res: Response) => {
  try {
    const allAppointments = await AppointmentService.getAllAppointments();
    res.status(200).json({
      message: "Successful",
      status: 200,
      data: allAppointments,
    });
  } catch (error) {
    res.status(500).json({
      message: (error as Error).message,
      status: 500,
    });
  }
};

export const deleteAppointment = async (req: Request, res: Response) => {
  try {
    const appointmentId = req.query.appointmentId as string;

    if (!appointmentId) {
      res.status(404).json({
        message: "Appointment not found.",
        status: 404,
      });
      return;
    }

    const result = await AppointmentService.deleteAppointment(appointmentId);

    if (result) {
      res.status(200).json({
        message: "Successful",
        status: 200,
      });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message, status: 500 });
  }
};
