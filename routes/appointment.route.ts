import express from "express";
import {
  createAppointment,
  getAllAppointments,
  getAllAppointmentsByUser,
  updateAppointment,
} from "../controllers/appointment.controller";
import { verifyToken } from "../middlewares/jwtMiddleware";
const router = express.Router();

router.get("/", verifyToken, getAllAppointments);
router.get("/getAppointmentsByUser", verifyToken, getAllAppointmentsByUser);
router.post("/create", verifyToken, createAppointment);
router.put("/update", verifyToken, updateAppointment);

export default router;
