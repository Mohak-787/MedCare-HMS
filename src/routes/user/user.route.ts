import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";

const router: Router = Router();

router.get("/info", authenticate);
router.patch("/", authenticate);
router.delete("/", authenticate);

export default Router;