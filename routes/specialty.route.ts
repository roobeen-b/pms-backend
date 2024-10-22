import express from "express";
import { getAllSpecialties } from "../controllers/specialty.controller";

const router = express.Router();

router.get("/getAllSpecialties", getAllSpecialties);

export default router;
