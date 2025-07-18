import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  timestamp,
  unique,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ✅ Enums
export const skillTypeEnum = pgEnum("skill_type", ["offered", "wanted"]);
export const swapStatusEnum = pgEnum("swap_status", [
  "pending",
  "accepted",
  "rejected",
  "deleted",
]);
export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

// ✅ Users table
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: userRoleEnum("role").default("user").notNull(),
  location: varchar("location", { length: 100 }),
  profilePhotoUrl: varchar("profile_photo_url", { length: 255 }),
  availability: varchar("availability", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// ✅ Skills table
export const skills = pgTable("skills", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  skillName: varchar("skill_name", { length: 100 }).notNull(),
  description: varchar("description", { length: 255 }),
  type: skillTypeEnum("type").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// ✅ Swaps table
export const swaps = pgTable("swaps", {
  id: uuid("id").defaultRandom().primaryKey(),
  requesterId: uuid("requester_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  receiverId: uuid("receiver_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  offeredSkillId: uuid("offered_skill_id")
    .notNull()
    .references(() => skills.id, { onDelete: "cascade" }),
  wantedSkillId: uuid("wanted_skill_id")
    .notNull()
    .references(() => skills.id, { onDelete: "cascade" }),
  status: swapStatusEnum("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// ✅ Endorsements table

export const endorsements = pgTable("endorsements", {
  id: uuid("id").defaultRandom().primaryKey(),
  endorserId: uuid("endorser_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  endorsedUserId: uuid("endorsed_user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  skillId: uuid("skill_id")
    .notNull()
    .references(() => skills.id, { onDelete: "cascade" }),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ✅ Ratings table
export const ratings = pgTable("ratings", {
  id: uuid("id").defaultRandom().primaryKey(),
  swapId: uuid("swap_id")
    .notNull()
    .references(() => swaps.id, { onDelete: "cascade" }),
  raterId: uuid("rater_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  ratedUserId: uuid("rated_user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(), // e.g. 1-5 stars
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

export default {
  users,
  skills,
  swaps,
  endorsements,
  ratings,
};
