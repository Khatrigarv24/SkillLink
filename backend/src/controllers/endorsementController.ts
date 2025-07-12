import { Request, Response } from "express";
import { db } from "../db/db";
import { endorsements } from "../db/schema/index";
import { eq } from "drizzle-orm";

// ✅ Create endorsement
export const createEndorsement = async (req: Request, res: Response) => {
  try {
    const endorserId = req.user?.id;
    const { endorsedUserId, skillId, comment } = req.body;

    if (!endorserId || !endorsedUserId || !skillId) {
      return res.status(400).json({
        message: "endorserId, endorsedUserId, and skillId are required",
      });
    }

    const newEndorsement = await db
      .insert(endorsements)
      .values({
        endorserId,
        endorsedUserId,
        skillId,
        comment,
      })
      .returning();

    res.status(201).json(newEndorsement[0]);
  } catch (err) {
    console.error("Create endorsement error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get endorsements for a specific user
export const getEndorsementsForUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const userEndorsements = await db
      .select()
      .from(endorsements)
      .where(eq(endorsements.endorsedUserId, userId));

    res.json(userEndorsements);
  } catch (err) {
    console.error("Get endorsements error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
