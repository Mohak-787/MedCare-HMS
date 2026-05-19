import { OtpController } from "../../controllers/otp/otp.controller";
import { Router } from "express";

const router: Router = Router();
const otpController = new OtpController();

router.post("/verify", otpController.verifyOtp);
router.post("resend", otpController.verifyOtp);

export default router;