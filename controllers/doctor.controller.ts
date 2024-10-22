import { Request, Response } from "express";
import DoctorService from "../services/doctor.service";
import uploadFileMiddleware from "../middlewares/fileUpload";
import multer from "multer";
import { checkRecordExists } from "../utils/sqlFunctions";

export const registerDoctorInfo = async (req: Request, res: Response) => {
  const { doctorId, docLicenseNo, specialties, doctorPhoto } = req.body;
  console.log(req.body);
  // if (!doctorId) {
  //   res.status(400).json({
  //     message: "Please register patient first.",
  //     status: 400,
  //   });
  //   return;
  // }

  // if (!docLicenseNo || !specialties || !doctorPhoto) {
  //   res.status(400).json({
  //     message: "Please fill all the required fields.",
  //     status: 400,
  //   });
  //   return;
  // }

  try {
    const checkUser = await checkRecordExists("users", "userId", doctorId);

    if (checkUser && checkUser.role !== "Doctor") {
      res.status(400).json({
        message: "User is not a doctor.",
        status: 400,
      });
      return;
    }

    await uploadFileMiddleware(req, res);

    if (!req.file) {
      res.status(400).json({
        message: "Please upload a photo.",
        status: 400,
      });
      return;
    }
    console.log(req.file);

    await DoctorService.registerDoctorInfo({
      doctorId,
      docLicenseNo,
      doctorPhoto: req.file.filename,
      specialties,
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
