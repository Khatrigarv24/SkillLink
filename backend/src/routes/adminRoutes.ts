import { Router } from "express";
import { deleteUser, makeUserAdmin } from "../controllers/adminController";
import { authenticate } from "../middlewares/authMiddleware";
import { isAdmin } from "../middlewares/adminMiddleware";

const router = Router();

router.post("/make-admin", authenticate, isAdmin, makeUserAdmin);
router.delete("/user/:id", authenticate, isAdmin, deleteUser);

export default router;
