import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");

let serviceAccount;

if (fs.existsSync(serviceAccountPath)) {
  serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));
} else {
  // Otherwise, get it from environment variable
  if (!process.env.FIREBASE_ADMIN_KEY) {
    throw new Error("FIREBASE_ADMIN_KEY environment variable not set!");
  }

  serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY);

  fs.writeFileSync(serviceAccountPath, JSON.stringify(serviceAccount, null, 2));
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log("Firebase Admin initialized ✅");
export default admin;
