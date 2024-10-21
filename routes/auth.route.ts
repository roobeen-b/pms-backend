import express from "express";
import {
  register,
  login,
  updateUserInfo,
} from "../controllers/auth.controller";
import { verifyToken } from "../middlewares/jwtMiddleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/updateUserInfo", verifyToken, updateUserInfo);

export default router;
