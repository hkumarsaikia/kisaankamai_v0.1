import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

function getRequiredPublicEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required Firebase public env: ${name}`);
  }
  return value;
}

export function getFirebaseClientApp() {
  const config = {
    apiKey: getRequiredPublicEnv("NEXT_PUBLIC_FIREBASE_API_KEY"),
    authDomain: getRequiredPublicEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
    projectId: getRequiredPublicEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
    storageBucket: getRequiredPublicEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: getRequiredPublicEnv("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
    appId: getRequiredPublicEnv("NEXT_PUBLIC_FIREBASE_APP_ID"),
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };

  return getApps().length ? getApp() : initializeApp(config);
}

export function getFirebaseAuthClient() {
  return getAuth(getFirebaseClientApp());
}
