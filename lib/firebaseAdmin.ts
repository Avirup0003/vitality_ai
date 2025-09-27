// lib/firebaseAdmin.ts
import admin from 'firebase-admin';

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID!;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL!;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY!;
  // Fix escaped newlines from env
  privateKey = privateKey.replace(/\\n/g, '\n');

  admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
  });
}

export const dbAdmin = admin.firestore();
export const AdminTimestamp = admin.firestore.Timestamp;
 