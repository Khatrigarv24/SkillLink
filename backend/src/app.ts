import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import * as dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import skillRoutes from "./routes/skillRoutes";
import adminRoutes from "./routes/adminRoutes";
import swapRoutes from "./routes/swapRoutes";
dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/swap", swapRoutes);

app.get("/", (req, res) => {
  res.send("SkillLink API is running 🚀");
});

export default app;
