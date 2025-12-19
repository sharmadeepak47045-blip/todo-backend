import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load service account from file
const serviceAccountPath = join(__dirname, '..', 'serviceAccountKey.json');
console.log('Looking for service account at:', serviceAccountPath);

try {
  const serviceAccount = JSON.parse(
    readFileSync(serviceAccountPath, 'utf8')
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Error loading Firebase service account:', error.message);
  console.error('Full path attempted:', serviceAccountPath);
  
  // Alternative: Try current directory
  const altPath = join(__dirname, 'serviceAccountKey.json');
  console.log('Trying alternative path:', altPath);
  
  try {
    const serviceAccount = JSON.parse(
      readFileSync(altPath, 'utf8')
    );
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    
    console.log('✅ Firebase initialized from alternative path');
  } catch (altError) {
    console.error('❌ Failed to initialize Firebase from both paths');
    throw altError;
  }
}

export default admin;