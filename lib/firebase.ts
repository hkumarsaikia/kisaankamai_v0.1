import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCeFikW5CPxlCA1KlgW1Pbz8K371xTpDTI",
  authDomain: "gokisaan.firebaseapp.com",
  projectId: "gokisaan",
  storageBucket: "gokisaan.firebasestorage.app",
  messagingSenderId: "385695590128",
<<<<<<< HEAD
  appId: "1:385695590128:web:8ae3734344861e8b808435"
=======
  appId: "1:385695590128:web:8ae3734344861e8b808435",
  measurementId: "G-P246QD9TH4"
>>>>>>> 30ed3e1d4c9aed32cc903a3a18066a3681038ae1
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;