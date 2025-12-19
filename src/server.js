import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./Routes/AuthRoute.js"
import todoRoutes from "./Routes/TodoRoute.js"
import feedbackRoutes from "./Routes/FeedbackRoute.js";
import adminRoutes from "./Routes/adminRoutes.js";

dotenv.config();

const app = express();

// 🔹 JSON parser
app.use(express.json());

// 🔹 CORS
app.use(cors({
  origin: [
    "http://localhost:3000", // React app
    "http://localhost:5173",
    "http://localhost:5174", 
    "http://localhost:5175",
    "http://localhost:5176"
  ],
  credentials: true
}));

// 🔹 DB Connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

// 🔹 Routes
app.use("/api/auth", authRoutes); // ✅ Google login route included
app.use("/api/todo", todoRoutes);  
app.use("/api/feedback", feedbackRoutes);
app.use("/admin", adminRoutes);

// 🔹 Root route
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

// 🔹 Error handling for unknown routes (optional but recommended)
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// 🔹 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
