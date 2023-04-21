import admin from 'firebase-admin'
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = JSON.parse(process.env.FIREBASE_ADMIN_KEY || "{}");

export const firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

export const db = admin.firestore();