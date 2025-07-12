import { Request, Response } from "express";
import { db } from "../db/db";
import { ratings } from "../db/schema/index";
import { eq } from "drizzle-orm";

// ✅ Create rating after swap completion
export const createRating = async (req: Request, res: Response) => {
  try {
    const raterId = req.user?.id;
    const { swapId, ratedUserId, rating, comment } = req.body;

    if (!swapId || !ratedUserId || !rating) {
      return res
        .status(400)
        .json({ message: "swapId, ratedUserId, and rating are required" });
    }

    const newRating = await db
      .insert(ratings)
      .values({
        swapId,
        raterId,
        ratedUserId,
        rating,
        comment,
      })
      .returning();

    res.status(201).json(newRating[0]);
  } catch (err) {
    console.error("Create rating error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get ratings for a user
export const getRatingsForUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const userRatings = await db
      .select()
      .from(ratings)
      .where(eq(ratings.ratedUserId, userId));

    res.json(userRatings);
  } catch (err) {
    console.error("Get ratings error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
