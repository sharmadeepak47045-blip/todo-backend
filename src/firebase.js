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
    
    // Clean the private key in file too
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.trim();
    }
  } else {
    console.log("❌ serviceAccountKey.json not found at:", serviceAccountPath);
    
    // 🔹 Fallback to environment variables (for Render)
    console.log("📝 Trying environment variables as fallback...");
    
    if (!process.env.FIREBASE_PRIVATE_KEY) {
      throw new Error("Neither serviceAccountKey.json nor FIREBASE_PRIVATE_KEY found");
    }

    // 🔹 FIX THIS LINE - Replace escaped newlines with actual newlines
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
      .replace(/\\n/g, '\n')  // This is the FIX!
      .trim();

    console.log("🔍 Debug Info:");
    console.log("- Private key length:", privateKey.length);
    console.log("- Contains BEGIN:", privateKey.includes("BEGIN PRIVATE KEY"));
    console.log("- Contains END:", privateKey.includes("END PRIVATE KEY"));
    console.log("- Project ID:", process.env.FIREBASE_PROJECT_ID);
    console.log("- Client Email:", process.env.FIREBASE_CLIENT_EMAIL);

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
  console.error("❌ Firebase Admin initialization failed:", error.message);
  
  // More helpful error message
  if (error.message.includes("Invalid PEM")) {
    console.error("\n💡 SOLUTION: Check your FIREBASE_PRIVATE_KEY environment variable");
    console.error("1. Make sure it has proper newlines (\\n)");
    console.error("2. Ensure it's the COMPLETE key (~1678 characters)");
    console.error("3. Check that BEGIN and END PRIVATE KEY lines are present");
  }
  
  throw error;
}

export default admin;