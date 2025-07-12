import { Request, Response } from "express";
import { db } from "../db/db";
import { skills } from "../db/schema/index";
import { eq } from "drizzle-orm";
import { asyncWrapProviders } from "async_hooks";
import { ref } from "process";

// ✅ Create Skill
export const createSkill = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { skillName, description, type } = req.body;

    if (!userId || !skillName || !type) {
      return res.status(400).json({
        message: "skillName, and type are required",
      });
    }

    const newSkill = await db
      .insert(skills)
      .values({
        skillName,
        description,
        type,
        userId, // ✅ assign from token
      })
      .returning();

    res.status(201).json(newSkill[0]);
  } catch (err) {
    console.error("Create skill error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get All Skills
export const getSkills = async (req: Request, res: Response) => {
  try {
    const allSkills = await db.select().from(skills);
    res.json(allSkills);
  } catch (err) {
    console.error("Get skills error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update Skill
export const updateSkill = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { skillName, description, type } = req.body;

    const updatedSkill = await db
      .update(skills)
      .set({
        skillName,
        description,
        type,
      })
      .where(eq(skills.id, id))
      .returning();

    res.json(updatedSkill[0]);
  } catch (err) {
    console.error("Update skill error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Delete Skill
export const deleteSkill = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await db.delete(skills).where(eq(skills.id, id));

    res.json({ message: "Skill deleted successfully" });
  } catch (err) {
    console.error("Delete skill error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserSkill = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userSkills = await db
      .select()
      .from(skills)
      .where(eq(skills.userId, userId));

    res.json(userSkills);
  } catch (err) {
    console.error("Get skills error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
