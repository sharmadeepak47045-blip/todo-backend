import admin from "firebase-admin";
import fs from "fs";
import path from "path";

let serviceAccount;

try {
  // 🔹 Local development: serviceAccountKey.json
  const serviceAccountPath = path.resolve("./src/serviceAccountKey.json");

  if (fs.existsSync(serviceAccountPath)) {
    console.log("📁 Loading Firebase config from serviceAccountKey.json");
    const serviceAccountFile = fs.readFileSync(serviceAccountPath, "utf8");
    serviceAccount = JSON.parse(serviceAccountFile);
  } 
  // 🔹 Production (Render): ENV variables
  else {
    console.log("📝 Loading Firebase config from environment variables");

    if (!process.env.FIREBASE_PRIVATE_KEY) {
      throw new Error("FIREBASE_PRIVATE_KEY is missing");
    }

    const privateKey = process.env.FIREBASE_PRIVATE_KEY
      .replace(/\\n/g, "\n")
      .replace(/^"|"$/g, "");

    serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: privateKey,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
    };
  }

  // 🔥 Initialize once
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("✅ Firebase Admin ready!");
  }

} catch (error) {
  console.error("❌ Firebase Admin init failed:", error);
  throw error;
}

export default admin;
