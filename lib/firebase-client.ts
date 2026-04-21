import type { FirebaseOptions } from "firebase/app";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const REQUIRED_FIREBASE_PUBLIC_ENV = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
] as const;

function readPublicEnv(name: (typeof REQUIRED_FIREBASE_PUBLIC_ENV)[number] | "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID") {
  return process.env[name]?.trim() || "";
}

export function getMissingFirebasePublicEnvNames() {
  return REQUIRED_FIREBASE_PUBLIC_ENV.filter((name) => !readPublicEnv(name));
}

export function getOptionalFirebaseClientConfig(): FirebaseOptions | null {
  if (getMissingFirebasePublicEnvNames().length) {
    return null;
  }

  return {
    apiKey: readPublicEnv("NEXT_PUBLIC_FIREBASE_API_KEY"),
    authDomain: readPublicEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
    projectId: readPublicEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
    storageBucket: readPublicEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: readPublicEnv("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
    appId: readPublicEnv("NEXT_PUBLIC_FIREBASE_APP_ID"),
    measurementId: readPublicEnv("NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID") || undefined,
  };
}

export function getFirebaseClientConfig() {
  const config = getOptionalFirebaseClientConfig();
  if (!config) {
    const [missing] = getMissingFirebasePublicEnvNames();
    throw new Error(`Missing required Firebase public env: ${missing}`);
  }

  return config;
}

export function getFirebaseClientAppOrNull() {
  const config = getOptionalFirebaseClientConfig();
  if (!config) {
    return null;
  }

  return getApps().length ? getApp() : initializeApp(config);
}

export function getFirebaseClientApp() {
  const app = getFirebaseClientAppOrNull();
  if (!app) {
    const [missing] = getMissingFirebasePublicEnvNames();
    throw new Error(`Missing required Firebase public env: ${missing}`);
  }

  return app;
}

export function getFirebaseAuthClientOrNull() {
  const app = getFirebaseClientAppOrNull();
  return app ? getAuth(app) : null;
}

export function getFirebaseAuthClient() {
  const auth = getFirebaseAuthClientOrNull();
  if (!auth) {
    const [missing] = getMissingFirebasePublicEnvNames();
    throw new Error(`Missing required Firebase public env: ${missing}`);
  }

  return auth;
}
