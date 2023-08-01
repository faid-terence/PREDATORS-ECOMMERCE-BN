import express from "express";
import authController from "../controller/otpAuthController.js";
import { checkUser } from "../middleware/roles.js";

const router = express.Router();

router.post("/otp/generate", checkUser, authController.GenerateOTP);
router.post("/otp/getotp", checkUser, authController.GetOTP);//generates otp by sms
router.post("/otp/verify", checkUser, authController.VerifyOTP);
router.post("/otp/validate", checkUser, authController.ValidateOTP);
router.post("/otp/disable", checkUser, authController.DisableOTP);

export default router;