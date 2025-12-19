// src/firebase.js
import admin from "firebase-admin";
import fs from "fs";
import path from "path";

// service account file ka path
const serviceAccountPath = path.join(process.cwd(), 'src/serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
  throw new Error("serviceAccountKey.json file not found!");
}

// JSON read karke parse karo
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));

// Firebase Admin initialize karo
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log("✅ Firebase Admin initialized");

export default admin;
