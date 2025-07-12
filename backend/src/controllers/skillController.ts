import { Request, Response } from "express";
import { db } from "../db/db";
import { skills, users } from "../db/schema/index";
import { eq, and } from "drizzle-orm";

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

export const getUsersBySkill = async (req: Request, res: Response) => {
  try {
    const skillId = req.params.skillId;
    const type = req.query.type as string | undefined; // Optional type filter

    let whereCondition;
    if (type && (type === 'offered' || type === 'wanted')) {
      whereCondition = and(
        eq(skills.id, skillId),
        eq(skills.type, type)
      );
    } else {
      whereCondition = eq(skills.id, skillId);
    }

    const query = db
      .select({
        userId: users.id,
        userName: users.name,
        skillId: skills.id,
        skillName: skills.skillName,
        skillType: skills.type
      })
      .from(skills)
      .innerJoin(users, eq(skills.userId, users.id))
      .where(whereCondition);

    const skillUsers = await query;
    res.json(skillUsers);
  } catch (err) {
    console.error("Get users by skill error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
