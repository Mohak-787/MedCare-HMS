import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { UserController } from "../../controllers/user/user.controller";

const router: Router = Router();
const userController = new UserController();

router.get("/info", authenticate(), userController.userInfo);
router.patch("/", authenticate(), userController.updateUser);
router.delete("/", authenticate(), userController.deleteUser);

export default router;