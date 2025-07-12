import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import * as dotenv from "dotenv";

dotenv.config();

const app: Application = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ✅ Routes
import authRoutes from "./routes/authRoutes";
// Import other routes as you implement them:
// import userRoutes from "./routes/userRoutes";
// import skillRoutes from "./routes/skillRoutes";

app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/skills", skillRoutes);

// ✅ Health check
app.get("/", (req, res) => {
  res.send("SkillLink API is running 🚀");
});

export default app;
