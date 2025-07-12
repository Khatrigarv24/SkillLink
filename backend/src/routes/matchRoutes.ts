import { Router } from "express";
import { getSkillMatches } from "../controllers/matchController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

// ✅ Get skill matches for current user
router.get("/", authenticate, getSkillMatches);

export default router;
