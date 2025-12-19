// src/firebase.js
import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ESM __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to your service account key
const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");

let serviceAccount;

// If service account file exists, read it
if (fs.existsSync(serviceAccountPath)) {
  serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));
} else {
  // Otherwise, get it from environment variable
  if (!process.env.FIREBASE_ADMIN_KEY) {
    throw new Error("FIREBASE_ADMIN_KEY environment variable not set!");
  }

  // Parse the env JSON string
  serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY);

  // Optional: write to local file for debugging (not needed in production)
  fs.writeFileSync(serviceAccountPath, JSON.stringify(serviceAccount, null, 2));
}

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log("Firebase Admin initialized ✅");
export default admin;
