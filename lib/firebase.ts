import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCeFikW5CPxlCA1KlgW1Pbz8K371xTpDTI",
  authDomain: "gokisaan.firebaseapp.com",
  projectId: "gokisaan",
  storageBucket: "gokisaan.firebasestorage.app",
  messagingSenderId: "385695590128",
  appId: "1:385695590128:web:8ae3734344861e8b808435",
  measurementId: "G-P246QD9TH4"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export default app;
