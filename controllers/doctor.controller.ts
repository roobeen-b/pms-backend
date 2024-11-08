import { Request, Response } from "express";
import DoctorService from "../services/doctor.service";
import multer from "multer";
import { checkRecordExists } from "../utils/sqlFunctions";
import { CustomRequest } from "../custom";

export const registerDoctorInfo = async (req: Request, res: Response) => {
  const {
    doctorId,
    doctorLicenseNo: docLicenseNo,
    specialties,
    doctorDesc,
  } = req.body;
  if (!doctorId) {
    res.status(400).json({
      message: "Please register patient first.",
      status: 400,
    });
    return;
  }

  if (!docLicenseNo || !specialties || !doctorDesc) {
    res.status(400).json({
      message: "Please fill all the required fields.",
      status: 400,
    });
    return;
  }

  if (!req.file) {
    res.status(400).json({
      message: "Please upload a photo.",
      status: 400,
    });
    return;
  }

  try {
    const checkUser = await checkRecordExists("users", "userId", doctorId);

    if (checkUser && checkUser.role !== "Doctor") {
      res.status(400).json({
        message: "User is not a doctor.",
        status: 400,
      });
      return;
    }

    await DoctorService.registerDoctorInfo({
      doctorId,
      docLicenseNo,
      doctorPhoto: req.file.filename,
      specialties,
      doctorDesc,
    });

    res.status(200).json({
      message: "Doctor registered successfully.",
      status: 200,
    });
  } catch (error) {
    if (
      error instanceof multer.MulterError &&
      error.code === "LIMIT_FILE_SIZE"
    ) {
      res.status(500).send({
        message: "File size cannot be larger than 2MB!",
      });
    }
    res.status(500).json({ message: (error as Error).message, status: 500 });
  }
};

export const getAllDoctors = async (req: Request, res: Response) => {
  try {
    const allDoctors = await DoctorService.getAllDoctors();
    res.status(200).json({
      message: "Successful",
      status: 200,
      data: allDoctors,
    });
  } catch (error) {
    res.status(500).json({
      message: (error as Error).message,
      status: 500,
    });
  }
};

export const getDoctorById = async (req: Request, res: Response) => {
  const doctorId = req.query.doctorId as string;
  if (!doctorId) {
    res.status(400).json({
      message: "Please provide doctor id.",
      status: 400,
    });
    return;
  }
  try {
    const doctor = await DoctorService.getDoctorById(doctorId);
    res.status(200).json({
      message: "Successful",
      status: 200,
      data: doctor,
    });
  } catch (error) {
    res.status(500).json({
      message: (error as Error).message,
      status: 500,
    });
  }
};
