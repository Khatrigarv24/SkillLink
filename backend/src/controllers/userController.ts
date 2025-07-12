import { Request, Response } from "express";
import { db } from "../db/db";
import { users } from "../db/schema/index";
import { eq } from "drizzle-orm";

// ✅ Get current user profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await db.select().from(users).where(eq(users.id, userId));

    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user[0]);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update current user profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name, location, availability, profilePhotoUrl } = req.body;

    const updatedUser = await db
      .update(users)
      .set({
        name,
        location,
        availability,
        profilePhotoUrl,
      })
      .where(eq(users.id, userId))
      .returning();

    res.json(updatedUser[0]);
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
