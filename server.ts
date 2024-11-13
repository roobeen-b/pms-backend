import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import { connectDB } from "./db/db";
import authRoutes from "./routes/auth.route";
import patientRoutes from "./routes/patient.route";
import appointmentRoutes from "./routes/appointment.route";
import doctorRoutes from "./routes/doctor.route";
import specialtyRoutes from "./routes/specialty.route";
import { verifyToken } from "./middlewares/jwtMiddleware";
import AppointmentService from "./services/appointment.service";
import PatientService from "./services/patient.service";
import DoctorService from "./services/doctor.service";
import { CustomRequest } from "./custom";
import { logger } from "./middlewares/logEvents";
import { errorHandler } from "./middlewares/errorHandler";

const port = process.env.PORT;

const app = express();

app.use(logger);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", authRoutes);
app.use("/patient", patientRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/doctors", doctorRoutes);
app.use("/specialty", specialtyRoutes);
app.use("/getAllCounts", verifyToken, async (req: CustomRequest, res) => {
  const id = req.userId;
  try {
    const appointmentCount = await AppointmentService.getAllAppointmentsCount(
      req.role!,
      id!
    );
    const patientCount = await PatientService.getAllPatientsCount();
    const doctorCount = await DoctorService.getAllDoctorsCount();
    res.status(200).json({
      message: "Successful",
      status: 200,
      data: { appointmentCount, patientCount, doctorCount },
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message, status: 500 });
  }
});

connectDB();

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
