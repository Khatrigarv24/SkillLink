import { Router } from "express";
import {
  createSkill,
  getSkills,
  updateSkill,
  deleteSkill,
  getUserSkill,
  getUsersBySkill,
} from "../controllers/skillController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authenticate, createSkill);
router.get("/", getSkills);
router.put("/:id", authenticate, updateSkill);
router.delete("/:id", authenticate, deleteSkill);
router.get("/me", authenticate, getUserSkill);
router.get("/:skillId/users", authenticate, getUsersBySkill);

export default router;
