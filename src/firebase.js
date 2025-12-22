// Update your firebase.js file to properly handle the private key
import admin from "firebase-admin";
import fs from "fs";
import path from "path";

let serviceAccount;

try {
  const serviceAccountPath = path.resolve("./src/serviceAccountKey.json");
  
  console.log(`📁 Looking for Firebase config at: ${serviceAccountPath}`);
  
  if (fs.existsSync(serviceAccountPath)) {
    console.log("✅ Found serviceAccountKey.json, loading from file...");
    const serviceAccountFile = fs.readFileSync(serviceAccountPath, "utf8");
    serviceAccount = JSON.parse(serviceAccountFile);
  } else {
    console.log("❌ serviceAccountKey.json not found, trying environment variables...");
    
    if (!process.env.FIREBASE_PRIVATE_KEY) {
      throw new Error("Neither serviceAccountKey.json nor FIREBASE_PRIVATE_KEY found");
    }

    // 🔹 IMPORTANT: Replace escaped newlines with actual newlines
    const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
    
    console.log("Private key length:", privateKey.length);
    console.log("Private key starts with:", privateKey.substring(0, 50));

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
  
  // Verify service account structure
  console.log("Service Account Keys:", Object.keys(serviceAccount));
  console.log("Private Key exists:", !!serviceAccount.private_key);
  console.log("Client Email exists:", !!serviceAccount.client_email);
  
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
  // Log more details about the error
  if (error.code === 'app/invalid-credential') {
    console.error("Check your private key format and length");
  }
  throw error;
}

export default admin;