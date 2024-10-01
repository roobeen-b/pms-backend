import express from "express";
import {
  getPatientInfo,
  registerPatientInfo,
  updatePatientInfo,
} from "../controllers/patient.controller";
import { verifyToken } from "../middlewares/jwtMiddleware";

const router = express.Router();

router.post("/registerPatientInfo", registerPatientInfo);
router.get("/getPatientInfo", verifyToken, getPatientInfo);
router.put("/updatePatientInfo", verifyToken, updatePatientInfo);

export default router;
