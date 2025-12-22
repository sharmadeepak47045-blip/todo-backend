import admin from "firebase-admin";
import fs from "fs";
import path from "path";

let serviceAccount;

try {
  // 🔹 Always try to load from file first
  const serviceAccountPath = path.resolve("./src/serviceAccountKey.json");
  
  console.log(`📁 Looking for Firebase config at: ${serviceAccountPath}`);
  
  if (fs.existsSync(serviceAccountPath)) {
    console.log("✅ Found serviceAccountKey.json, loading from file...");
    const serviceAccountFile = fs.readFileSync(serviceAccountPath, "utf8");
    serviceAccount = JSON.parse(serviceAccountFile);
  } else {
    console.log("❌ serviceAccountKey.json not found at:", serviceAccountPath);
    
    // 🔹 Fallback to environment variables (for Render)
    console.log("📝 Trying environment variables as fallback...");
    
    if (!process.env.FIREBASE_PRIVATE_KEY) {
      throw new Error("Neither serviceAccountKey.json nor FIREBASE_PRIVATE_KEY found");
    }

    const privateKey = process.env.FIREBASE_PRIVATE_KEY.trim();


    serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: privateKey,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
    };
  }

  console.log("🔧 Initializing Firebase Admin...");
  
  // 🔥 Initialize once
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("✅ Firebase Admin initialized successfully!");
  } else {
    console.log("⚠️ Firebase Admin already initialized");
  }

} catch (error) {
  console.error("❌ Firebase Admin initialization failed:", error);
  throw error;
}

export default admin;