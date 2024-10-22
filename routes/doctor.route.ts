import express from "express";
import { registerDoctorInfo } from "../controllers/doctor.controller";

const router = express.Router();

router.post("/registerDoctorInfo", registerDoctorInfo);

export default router;
