import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDjstec2LZmBGV_2CwhnrIJDOIGOl5Y-Cs",
  authDomain: "kisan-kamai-otp-test.firebaseapp.com",
  projectId: "kisan-kamai-otp-test",
  storageBucket: "kisan-kamai-otp-test.firebasestorage.app",
  messagingSenderId: "703663766582",
  appId: "1:703663766582:web:76221dca9031159b0d2c97"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
