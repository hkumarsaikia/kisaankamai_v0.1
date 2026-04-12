import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCeFikW5CPxlCA1KlgW1Pbz8K371xTpDTI",
  authDomain: "gokisaan.firebaseapp.com",
  projectId: "gokisaan",
  storageBucket: "gokisaan.firebasestorage.app",
  messagingSenderId: "385695590128",
  appId: "1:385695590128:web:8ae3734344861e8b808435"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;