import { Router } from "express";
import authRoutes from "./auth/auth.route";
import userRoutes from "./user/user.route";

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);

export default router;