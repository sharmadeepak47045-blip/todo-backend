import admin from "firebase-admin";
import fs from "fs";
import path from "path";

// Absolute path of serviceAccountKey.json
const serviceAccountPath = path.resolve("src/serviceAccountKey.json");

// 🔴 Safety check
if (!fs.existsSync(serviceAccountPath)) {
  throw new Error("❌ serviceAccountKey.json not found in src folder");
}

// Read & parse JSON
const serviceAccount = JSON.parse(
  fs.readFileSync(serviceAccountPath, "utf8")
);

// Initialize only once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

console.log("✅ Firebase Admin initialized successfully");

export default admin;
