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
router.post("/send-reset-otp", sendResetOtp);
router.post("/reset-password", resetPassword);
router.post("/google", googleLogin);
export default router;
