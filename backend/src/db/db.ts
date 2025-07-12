import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema/index";
import * as dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

export type DB = typeof db;

(async () => {
  try {
    await pool.connect();
    console.log("✅ Connected to PostgreSQL database successfully!");
  } catch (err) {
    console.error("❌ Database connection error:", err);
  }
})();
