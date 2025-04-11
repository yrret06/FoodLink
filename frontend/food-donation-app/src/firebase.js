// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCMuiA_6Av1ZO_-B18EwiN1KlgSfaWzoXU",
  authDomain: "foodlink-32d5c.firebaseapp.com",
  projectId: "foodlink-32d5c",
  storageBucket: "foodlink-32d5c.firebasestorage.app",
  messagingSenderId: "305702394122",
  appId: "1:305702394122:web:e9271543666a66e7f242f3",
  measurementId: "G-K5KT6T63T1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
