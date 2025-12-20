// src/firebase.js
import admin from "firebase-admin";
import fs from "fs";
import path from "path";

// 🔹 Path to your service account JSON
const serviceAccountPath = path.join(process.cwd(), "src/serviceAccountKey.json");

// 🔹 Check if file exists
if (!fs.existsSync(serviceAccountPath)) {
  throw new Error(
    "❌ serviceAccountKey.json file not found! Make sure it is in the src folder."
  );
}

// 🔹 Read and parse the JSON file
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));

// 🔹 Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

console.log("✅ Firebase Admin initialized");

export default admin;
