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

const port = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", authRoutes);
app.use("/patient", patientRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/doctors", doctorRoutes);
app.use("/specialty", specialtyRoutes);

connectDB();

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
