import express from "express";
import {
  getPatientInfo,
  registerPatientInfo,
} from "../controllers/patientController";
import { verifyToken } from "../middlewares/jwtMiddleware";

const router = express.Router();

router.post("/registerPatientInfo", registerPatientInfo);
router.get("/getPatientInfo", verifyToken, getPatientInfo);

export default router;
