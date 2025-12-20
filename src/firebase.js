import admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();

// Ensure the env variable exists
if (!process.env.FIREBASE_ADMIN_KEY) {
  throw new Error("❌ FIREBASE_ADMIN_KEY environment variable missing");
}

// Parse JSON and convert \\n to real newlines
const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY);
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

console.log("✅ Firebase Admin initialized successfully");
export default admin;
