import admin from "firebase-admin";
import fs from "fs";
import path from "path";

// File ka path
const serviceAccountPath = path.join(process.cwd(), 'src/serviceAccountKey.json');


if (!fs.existsSync(serviceAccountPath)) {
  throw new Error("serviceAccountKey.json file not found! Make sure it is in the src folder.");
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log("✅ Firebase Admin initialized");

export default admin;
