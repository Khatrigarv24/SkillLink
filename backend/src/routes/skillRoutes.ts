import { Router } from "express";
import {
  createSkill,
  getSkills,
  updateSkill,
  deleteSkill,
} from "../controllers/skillController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authenticate, createSkill);
router.get("/", getSkills);
router.put("/:id", authenticate, updateSkill);
router.delete("/:id", authenticate, deleteSkill);

export default router;
