import express from "express";
import {
  signup,
  login,
  sendResetOtp,
  resetPassword,
  googleLogin
} from "../controllers/AuthController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleLogin);

router.post("/send-reset-otp", sendResetOtp);   // ✅ MATCHES FRONTEND
router.post("/reset-password", resetPassword);

export default router;
