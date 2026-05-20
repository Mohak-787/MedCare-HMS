import { Router } from "express";
import { AuthController } from "../../controllers/auth/auth.controller";
import { authenticate, tempAuthenticate } from "../../middlewares/auth.middleware";

const router: Router = Router();
const authController = new AuthController();

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);

router.patch("/change-password", authenticate(), authController.changePassword);
router.patch("/reset-password", tempAuthenticate, authController.resetPassword);

router.post("/forgot-password", authController.forgotPassword);

export default router;