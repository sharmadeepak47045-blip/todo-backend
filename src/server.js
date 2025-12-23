// server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// 🔥 Firebase Admin init (only once)
import "./firebase.js";

// Routes
import authRoutes from "./Routes/AuthRoute.js";
import todoRoutes from "./Routes/TodoRoute.js";
import feedbackRoutes from "./Routes/FeedbackRoute.js";
import adminRoutes from "./Routes/adminRoutes.js";

const app = express();

/* =======================
   Middleware
======================= */
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      process.env.FRONTEND_URL,
      "https://todo-frontend-delta-tawny.vercel.app",
      "https://todo-frontend-git-main-deepak-s-projects-3ef3c471.vercel.app",
    ],
    credentials: true,
  })
);

/* =======================
   MongoDB Connection
======================= */
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI missing in .env");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  });

/* =======================
   Routes
======================= */
app.use("/api/auth", authRoutes);
app.use("/api/todo", todoRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/admin", adminRoutes);

/* =======================
   Health Check
======================= */
app.get("/", (req, res) => {
  res.status(200).send("🚀 Backend running successfully");
});

/* =======================
   404 Handler
======================= */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* =======================
   Server Start
======================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
