import { Request, Response } from "express";
import { db } from "../db/db";
import { users } from "../db/schema/index";
import { eq } from "drizzle-orm";

export const makeUserAdmin = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const updatedUser = await db
      .update(users)
      .set({ role: "admin" })
      .where(eq(users.id, userId))
      .returning();

    if (updatedUser.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User promoted to admin successfully",
      user: updatedUser[0],
    });
  } catch (err) {
    console.error("Make user admin error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedUser = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning();

    if (deletedUser.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully", user: deletedUser[0] });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
