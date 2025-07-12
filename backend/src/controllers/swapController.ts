import { Request, Response } from "express";
import { db } from "../db/db";
import { swaps } from "../db/schema/index";
import { eq, or } from "drizzle-orm";

// ✅ Create swap request
export const createSwap = async (req: Request, res: Response) => {
  try {
    const requesterId = req.user?.id;

    if (!requesterId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No requester ID found" });
    }

    const { receiverId, offeredSkillId, wantedSkillId } = req.body;

    if (!receiverId || !offeredSkillId || !wantedSkillId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newSwap = await db
      .insert(swaps)
      .values({
        requesterId,
        receiverId,
        offeredSkillId,
        wantedSkillId,
      })
      .returning();

    res.status(201).json(newSwap[0]);
  } catch (err) {
    console.error("Create swap error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get swaps involving the user
export const getSwaps = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user ID found" });
    }

    const userSwaps = await db
      .select()
      .from(swaps)
      .where(or(eq(swaps.requesterId, userId), eq(swaps.receiverId, userId)));

    res.json(userSwaps);
  } catch (err) {
    console.error("Get swaps error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update swap status
export const updateSwapStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["accepted", "rejected", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedSwap = await db
      .update(swaps)
      .set({ status })
      .where(eq(swaps.id, id))
      .returning();

    if (updatedSwap.length === 0) {
      return res.status(404).json({ message: "Swap not found" });
    }

    res.json(updatedSwap[0]);
  } catch (err) {
    console.error("Update swap status error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllSwaps = async (req: Request, res: Response) => {
  try {
    const allSwaps = await db.select().from(swaps);
    res.json(allSwaps);
  } catch (err) {
    console.error("Get all swaps error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
