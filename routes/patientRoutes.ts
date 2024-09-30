import express from "express";
import { registerPatientInfo } from "../controllers/patientController";

const router = express.Router();

router.post("/registerPatientInfo", registerPatientInfo);

export default router;
