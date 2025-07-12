import { Router } from "express";
import { getProfile, updateProfile, getAllUsers } from "../controllers/userController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

router.get("/me", authenticate, getProfile);
router.put("/me", authenticate, updateProfile);
router.get("/", authenticate, getAllUsers);

export default router;
