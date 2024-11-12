import { Request, Response } from "express";
import { createTable, checkRecordExists } from "../utils/sqlFunctions";
import { patientSchema } from "../schemas/patient.schema";
import { CustomRequest } from "../custom";
import moment from "moment";
import { PatientModel, UpdatePatientModel } from "../models/patient.model";
import PatientService from "../services/patient.service";

export const registerPatientInfo = async (req: Request, res: Response) => {
  const patient: PatientModel = {
    ...req.body,
    createdDate: moment().toDate(),
  };

  if (
    !patient.privacyConsent ||
    !patient.treatmentConsent ||
    !patient.disclosureConsent
  ) {
    res.status(400).json({
      message: "Please fill all the required fields.",
      status: 400,
    });
    return;
  }

  try {
    await createTable(patientSchema);
    const patientAlreadyExists = await checkRecordExists(
      "patients",
      "userId",
      patient.userId
    );
    if (patientAlreadyExists) {
      res.status(409).json({
        message: "Patient already exists",
        status: 200,
      });
    } else {
      await PatientService.registerPatientInfo(patient);
      res.status(201).json({
        message: "Patient created successfully",
        status: 201,
        data: {
          userId: patient.userId,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message, status: 500 });
  }
};

export const updatePatientInfo = async (req: Request, res: Response) => {
  const patient: UpdatePatientModel = {
    ...req.body,
    updatedDate: moment().toDate(),
  };

  try {
    const patientExists = await checkRecordExists(
      "patients",
      "userId",
      patient.userId
    );
    if (patientExists) {
      await PatientService.updatePatientInfo(patient);
      res.status(200).json({
        message: "Patient updated successfully",
        status: 200,
      });
    } else {
      res.status(200).json({
        message: "Patient does not exist",
        status: 200,
      });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message, status: 500 });
  }
};

export const getPatientInfo = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const patientId = req.query.patientId as string;

    if (patientId) {
      const patientData = await PatientService.getPatientInfo(patientId);

      if (patientData !== undefined && patientData !== null) {
        res.status(200).json({
          message: "Successful",
          status: 200,
          data: patientData,
        });
      } else {
        res.status(200).json({
          message: "Patient not found",
          status: 200,
        });
      }
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message, status: 500 });
  }
};

export const getAllPatients = async (req: Request, res: Response) => {
  try {
    const allPatients = await PatientService.getAllPatients();

    if (allPatients) {
      res.status(200).json({
        message: "Suceessful",
        status: 200,
        data: allPatients,
      });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message, status: 500 });
  }
};

export const deletePatient = async (req: Request, res: Response) => {
  try {
    const patientId = req.query.patientId as string;

    if (!patientId) {
      res.status(404).json({
        message: "Patient not found.",
        status: 404,
      });
      return;
    }

    const result = await PatientService.deletePatient(patientId);

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
