import { Router } from "express";
import authRoutes from "./auth/auth.route";

const router: Router = Router();

router.use("/auth", authRoutes);

export default router;