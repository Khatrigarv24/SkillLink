import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/userController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

router.get("/me", authenticate, getProfile);
router.put("/me", authenticate, updateProfile);

export default router;
