import { Router } from "express";
import { AuthController } from "../../controllers/auth/auth.controller";

const router: Router = Router();
const authController = new AuthController();

router.post("/signup", authController.signup);
//router.post("/signin");

export default router;