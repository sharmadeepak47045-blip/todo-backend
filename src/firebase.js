import dotenv from "dotenv";
dotenv.config();

import admin from "firebase-admin";

const firebaseKey = process.env.FIREBASE_ADMIN_KEY;

if (!firebaseKey) throw new Error("❌ FIREBASE_ADMIN_KEY environment variable is missing");

let serviceAccount;
try {
  serviceAccount = JSON.parse(firebaseKey);
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
} catch (err) {
  throw new Error("❌ Invalid FIREBASE_ADMIN_KEY JSON format");
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

console.log("🔥 Firebase Admin initialized successfully");

export default admin;
