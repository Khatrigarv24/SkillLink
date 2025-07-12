import { Router } from "express";
import {
  createSwap,
  deleteSwap,
  getAllSwaps,
  getSwaps,
  updateSwapStatus,
} from "../controllers/swapController";
import { authenticate } from "../middlewares/authMiddleware";
import { isAdmin } from "../middlewares/adminMiddleware";

const router = Router();

router.post("/", authenticate, createSwap);
router.get("/", authenticate, getSwaps);
router.put("/:id/status", authenticate, updateSwapStatus);
router.get("/all", authenticate, isAdmin, getAllSwaps);
router.delete("/:id", authenticate, isAdmin, deleteSwap);

export default router;
