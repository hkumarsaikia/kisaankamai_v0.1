import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD9TTYR36f4dWCW1Qhp-iiemjqyDv278mE",
  authDomain: "kisaan-kamai-auth-prod.firebaseapp.com",
  projectId: "kisaan-kamai-auth-prod",
  storageBucket: "kisaan-kamai-auth-prod.firebasestorage.app",
  messagingSenderId: "390146762141",
  appId: "1:390146762141:web:03e3107836a01b5331bb74"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
