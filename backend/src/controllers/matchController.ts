import { Request, Response } from "express";
import { db } from "../db/db";
import { skills, users } from "../db/schema/index";
import { eq, and, ne } from "drizzle-orm";

// ✅ Matching algorithm: mutual skill swaps
export const getSkillMatches = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Get current user's offered and wanted skills
    const userOfferedSkills = await db
      .select()
      .from(skills)
      .where(and(eq(skills.userId, userId), eq(skills.type, "offered")));

    const userWantedSkills = await db
      .select()
      .from(skills)
      .where(and(eq(skills.userId, userId), eq(skills.type, "wanted")));

    const matches = [];

    for (const wanted of userWantedSkills) {
      // Find users offering the skill I want
      const potentialPartners = await db
        .select({
          userId: skills.userId,
          skillName: skills.skillName,
        })
        .from(skills)
        .where(
          and(
            eq(skills.skillName, wanted.skillName),
            eq(skills.type, "offered"),
            ne(skills.userId, userId), // exclude self
          ),
        );

      for (const partner of potentialPartners) {
        // Check if partner wants any of my offered skills
        for (const offered of userOfferedSkills) {
          const partnerWantsMySkill = await db
            .select()
            .from(skills)
            .where(
              and(
                eq(skills.userId, partner.userId),
                eq(skills.skillName, offered.skillName),
                eq(skills.type, "wanted"),
              ),
            );

          if (partnerWantsMySkill.length > 0) {
            matches.push({
              partnerId: partner.userId,
              youOffer: offered.skillName,
              theyWant: offered.skillName,
              theyOffer: wanted.skillName,
              youWant: wanted.skillName,
            });
          }
        }
      }
    }

    res.json({ matches });
  } catch (err) {
    console.error("Get skill matches error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
