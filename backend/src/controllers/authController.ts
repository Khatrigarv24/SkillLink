import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db/db";
import { users } from "../db/schema/index";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const newUser = await db
      .insert(users)
      .values({
        name,
        email,
        passwordHash: hashedPassword,
      })
      .returning();

    // Generate JWT
    const token = jwt.sign(
      { userId: newUser[0].id, role: newUser[0].role },
      JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.status(201).json({ token, user: newUser[0] });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await db.select().from(users).where(eq(users.email, email));

    if (user.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user[0].passwordHash);

    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user[0].id, role: user[0].role },
      JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.status(200).json({ token, user: user[0] });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
