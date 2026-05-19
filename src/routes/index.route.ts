import { Router } from "express";
import authRoutes from "./auth/auth.route";
import userRoutes from "./user/user.route";
import otpRoutes from "./otp/otp.route";

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/otp", otpRoutes);

export default router;