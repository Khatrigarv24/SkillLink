import { Router } from "express";
import {
  createRating,
  getRatingsForUser,
} from "../controllers/ratingController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

// ✅ Create rating
router.post("/", authenticate, createRating);

// ✅ Get ratings for a user
router.get("/:userId", authenticate, getRatingsForUser);

export default router;
