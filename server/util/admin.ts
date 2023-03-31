import admin from 'firebase-admin'
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = JSON.parse(process.env.FIREBASE_ADMIN_KEY || "{}");

admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig)
});

const db = admin.firestore();
module.exports = { admin, db }