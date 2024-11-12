import express from "express";
import {
  deleteDoctor,
  getAllDoctors,
  getDoctorById,
  registerDoctorInfo,
} from "../controllers/doctor.controller";
import uploadFileMiddleware from "../middlewares/fileUpload";
import { verifyToken } from "../middlewares/jwtMiddleware";

const router = express.Router();

router.post(
  "/registerDoctorInfo",
  uploadFileMiddleware.single("doctorPhoto"),
  registerDoctorInfo
);
router.get("/getAllDoctors", getAllDoctors);
router.get("/getDoctorById", verifyToken, getDoctorById);
router.delete("/deleteDoctor", verifyToken, deleteDoctor);

export default router;
