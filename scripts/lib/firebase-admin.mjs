import { applicationDefault, cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { getFirebaseAdminConfig } from "./env.mjs";

function createAdminApp() {
  const config = getFirebaseAdminConfig();

  if (config.clientEmail && config.privateKey) {
    return initializeApp({
      credential: cert({
        projectId: config.projectId,
        clientEmail: config.clientEmail,
        privateKey: config.privateKey,
      }),
      projectId: config.projectId,
      storageBucket: config.storageBucket,
    });
  }

  return initializeApp({
    credential: applicationDefault(),
    projectId: config.projectId,
    storageBucket: config.storageBucket,
  });
}

export function getAdminApp() {
  return getApps().length ? getApp() : createAdminApp();
}

export function getAdminAuth() {
  return getAuth(getAdminApp());
}

export function getAdminDb() {
  const db = getFirestore(getAdminApp());
  try {
    db.settings({ ignoreUndefinedProperties: true });
  } catch {
    // Ignore hot-reload duplicate settings errors.
  }
  return db;
}

export function getAdminStorage() {
  return getStorage(getAdminApp());
}
