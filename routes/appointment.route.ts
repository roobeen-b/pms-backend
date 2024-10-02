import express from "express";
import {
  createAppointment,
  getAllAppointments,
  getAllAppointmentsByUser,
} from "../controllers/appointment.controller";
import { verifyToken } from "../middlewares/jwtMiddleware";
const router = express.Router();

router.get("/", verifyToken, getAllAppointments);
router.get("/getAppointmentsByUser", verifyToken, getAllAppointmentsByUser);
router.post("/create", verifyToken, createAppointment);

export default router;
