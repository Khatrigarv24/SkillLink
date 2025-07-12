import { Router } from "express";
import { makeUserAdmin } from "../controllers/adminController";
import { authenticate } from "../middlewares/authMiddleware";
import { isAdmin } from "../middlewares/adminMiddleware";

const router = Router();

router.post("/make-admin", authenticate, isAdmin, makeUserAdmin);

export default router;
