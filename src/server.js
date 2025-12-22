// server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "./firebase.js"

import authRoutes from "./Routes/AuthRoute.js";
import todoRoutes from "./Routes/TodoRoute.js";
import feedbackRoutes from "./Routes/FeedbackRoute.js";
import adminRoutes from "./Routes/adminRoutes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173","http://localhost:5174","http://localhost:5175","https://todo-frontend-delta-tawny.vercel.app",
      process.env.FRONTEND_URL],
    credentials: true,
  })
);

// Connect to local MongoDB
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI not found in .env. Add MONGO_URI=mongodb://127.0.0.1:27017/todo-app");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected (Local)"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/todo", todoRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/admin", adminRoutes);

// Root
app.get("/", (req, res) => res.send("🚀 Server running"));

// 404
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
