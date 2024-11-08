import express from "express";
import {
  createAppointment,
  getAllAppointments,
  getAllAppointmentsByDoctor,
  getAllAppointmentsByUser,
  updateAppointment,
} from "../controllers/appointment.controller";
import { verifyToken } from "../middlewares/jwtMiddleware";
const router = express.Router();

router.get("/", verifyToken, getAllAppointments);
router.get("/getAppointmentsByUser", verifyToken, getAllAppointmentsByUser);
router.get("/getAppointmentsByDoctor", verifyToken, getAllAppointmentsByDoctor);
router.post("/create", verifyToken, createAppointment);
router.put("/update", verifyToken, updateAppointment);

export default router;
