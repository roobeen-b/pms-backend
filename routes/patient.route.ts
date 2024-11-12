import express from "express";
import {
  deletePatient,
  getAllPatients,
  getPatientInfo,
  registerPatientInfo,
  updatePatientInfo,
} from "../controllers/patient.controller";
import { verifyToken } from "../middlewares/jwtMiddleware";

const router = express.Router();

router.post("/registerPatientInfo", registerPatientInfo);
router.get("/getPatientInfo", verifyToken, getPatientInfo);
router.get("/getAllPatients", verifyToken, getAllPatients);
router.put("/updatePatientInfo", verifyToken, updatePatientInfo);
router.delete("/deletePatient", verifyToken, deletePatient);

export default router;
