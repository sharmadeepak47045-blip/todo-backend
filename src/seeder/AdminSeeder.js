import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../Models/user.js";

dotenv.config();

const start = async () => {
  try {
    // 1️⃣ Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    // 2️⃣ Create SUPER ADMIN (main admin user)
    const existingAdminUser = await User.findOne({ email: "admin@gmail.com" });

    if (existingAdminUser) {
      console.log("✅ Admin user already exists in User collection");
    } else {
      const hashedPassword = await bcrypt.hash("Admin@123", 10);

      const adminUser = await User.create({
        name: "Super Admin",
        email: "admin@gmail.com",
        password: hashedPassword,
        role: "admin",
        isVerified: true,
      });

      console.log("✅ Admin user created:", adminUser.email);
    }

    const existingAdmin = await User.findOne({ username: "admin" });

    if (existingAdmin) {
      console.log("✅ Admin already exists in Admin panel collection");
    } else {
      const adminHashedPassword = await bcrypt.hash("Admin@123", 10);

      const admin = await User.create({
        name: "Panel Admin",      
        username: "admin",
        email: "admin@gmail.com",
        password: adminHashedPassword,
        role: "admin",
        isVerified: true,
      });

      console.log("✅ Admin created in Admin collection:", admin.username);
    }
    process.exit();
  } catch (error) {
    console.log("❌ Seeder Error:", error.message);
    process.exit(1);
  }
};

start();