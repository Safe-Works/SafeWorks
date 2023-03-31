import admin from 'firebase-admin'
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = JSON.parse(process.env.FIREBASE_ADMIN_KEY || "{}");

export const firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig)
});

export const db = admin.firestore();