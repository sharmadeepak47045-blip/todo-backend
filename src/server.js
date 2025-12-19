import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// Routes
import authRoutes from "./Routes/AuthRoute.js";
import todoRoutes from "./Routes/TodoRoute.js";
import feedbackRoutes from "./Routes/FeedbackRoute.js";
import adminRoutes from "./Routes/adminRoutes.js";

const app = express();

// ------------------ MIDDLEWARE ------------------
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176",
    ],
    credentials: true,
  })
);

// ------------------ DATABASE ------------------
const MONGO_URI =
  process.env.MONGO_URI_CLOUD || process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  });

// ------------------ ROUTES ------------------
app.use("/api/auth", authRoutes);
app.use("/api/todo", todoRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/admin", adminRoutes);

// ------------------ ROOT ------------------
app.get("/", (req, res) => {
  res.send("🚀 Server is running");
});

// ------------------ 404 ------------------
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ------------------ START ------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);
