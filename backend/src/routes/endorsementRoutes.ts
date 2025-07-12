import { Router } from "express";
import {
  createEndorsement,
  getEndorsementsForUser,
} from "../controllers/endorsementController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

// ✅ Create endorsement
router.post("/", authenticate, createEndorsement);

// ✅ Get endorsements for a specific user
router.get("/:userId", authenticate, getEndorsementsForUser);

export default router;
