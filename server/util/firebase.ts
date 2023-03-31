import { initializeApp } from "firebase/app";
import firestore from "firebase/firestore";
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "safeworks-296f8.firebaseapp.com",
  projectId: "safeworks-296f8",
  storageBucket: "safeworks-296f8.appspot.com",
  messagingSenderId: "187262992528",
  appId: "1:187262992528:web:c3470ce017c5e25fd8d815",
  measurementId: "G-VRBYYR371H"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
export { firebase, firebaseConfig, firestore };