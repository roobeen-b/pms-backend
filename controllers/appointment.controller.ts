import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { CreateAppointmentModel } from "../models/appointment.model";
import AppointmentService from "../services/appointment.service";
import { CustomRequest } from "../custom";

export const createAppointment = async (req: Request, res: Response) => {
  const {
    schedule,
    reason,
    note,
    primaryPhysician,
    status,
    cancellationReason,
    userId,
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
