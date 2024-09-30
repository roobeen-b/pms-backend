import { Request, Response } from "express";
import {
  createTable,
  checkRecordExists,
  insertRecord,
  getJoinedRecords,
} from "../utils/sqlFunctions";
import { patientSchema } from "../schemas/patientSchema";
import { CustomRequest } from "../custom";

type Gender = "male" | "female" | "other";
interface PatientModel {
  userId: string;
  birthDate: Date;
  gender: Gender;
  address: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  primaryPhysician: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  allergies?: string | undefined;
  currentMedication?: string | undefined;
  familyMedicalHistory?: string | undefined;
  pastMedicalHistory?: string | undefined;
  identificationType?: string | undefined;
  identificationNumber?: string | undefined;
  identificationDocumentId?: string | undefined;
  identificationDocumentUrl?: string | undefined;
  identificationDocument?: FormData | undefined;
  privacyConsent: number;
  treatmentConsent: number;
  disclosureConsent: number;
}

export const registerPatientInfo = async (req: Request, res: Response) => {
  const {
    userId,
    gender,
    birthDate,
    address,
    occupation,
    emergencyContactName,
    emergencyContactNumber,
    insuranceProvider,
    insurancePolicyNumber,
    allergies,
    currentMedication,
    familyMedicalHistory,
    pastMedicalHistory,
    identificationType,
    identificationNumber,
    identificationDocumentId,
    identificationDocumentUrl,
    primaryPhysician,
    privacyConsent,
    treatmentConsent,
    disclosureConsent,
  } = req.body;

  if (!privacyConsent || !treatmentConsent || !disclosureConsent) {
    res.status(400).json({
      message: "Please fill all the required fields.",
      status: 400,
    });
    return;
  }

  const patient: PatientModel = {
    userId,
    gender,
    birthDate,
    address,
    occupation,
    emergencyContactName,
    emergencyContactNumber,
    insuranceProvider,
    insurancePolicyNumber,
    allergies,
    currentMedication,
    familyMedicalHistory,
    pastMedicalHistory,
    identificationType,
    identificationNumber,
    identificationDocumentId,
    identificationDocumentUrl,
    primaryPhysician,
    privacyConsent: true ? 1 : 0,
    treatmentConsent: true ? 1 : 0,
    disclosureConsent: true ? 1 : 0,
  };

  try {
    await createTable(patientSchema);
    const patientAlreadyExists = await checkRecordExists(
      "patients",
      "userId",
      patient.userId
    );
    if (patientAlreadyExists) {
      res.status(409).json({ message: "Patient already exists", status: 409 });
    } else {
      await insertRecord("patients", patient);
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

export const getPatientInfo = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    const patientData = await getJoinedRecords(
      "patients",
      "users",
      "userId",
      "userId",
      userId
    );

    let newPatientData: { [key: string]: any } = {};
    for (const key in patientData) {
      if (key != "password") {
        newPatientData[key] = patientData[key];
      }
    }

    if (newPatientData) {
      res.status(200).json({
        message: "Successful",
        status: 200,
        data: newPatientData,
      });
    } else {
      res.status(200).json({
        message: "Patient not found",
        status: 200,
      });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message, status: 500 });
  }
};
