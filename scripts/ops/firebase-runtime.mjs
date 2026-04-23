import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { loadRuntimeEnv, requireEnv } from "./shared-env.mjs";

function resolvePrivateKey() {
  const value = process.env.FIREBASE_PRIVATE_KEY;
  if (!value) {
    return "";
  }

  return value.trim().replace(/^["']|["']$/g, "").replace(/\\n/g, "\n");
}

let runtimeCache = null;

export async function getFirebaseRuntime() {
  if (runtimeCache) {
    return runtimeCache;
  }

  await loadRuntimeEnv();

  const projectId =
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    "gokisaan";
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || "";
  const privateKey = resolvePrivateKey();
  const storageBucket =
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    `${projectId}.firebasestorage.app`;

  const app =
    getApps()[0] ||
    (clientEmail && privateKey
      ? initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey,
          }),
          projectId,
          storageBucket,
        })
      : initializeApp({
          credential: applicationDefault(),
          projectId,
          storageBucket,
        }));

  const db = getFirestore(app);
  db.settings({ ignoreUndefinedProperties: true });

  runtimeCache = {
    app,
    auth: getAuth(app),
    db,
    storage: getStorage(app),
    bucket: getStorage(app).bucket(storageBucket),
    projectId,
    storageBucket,
  };

  return runtimeCache;
}

export function getCloudPlatformScope() {
  return requireEnv("FIREBASE_PROJECT_ID");
}

export function buildFirebaseDownloadUrl(bucketName, objectPath, token) {
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(objectPath)}?alt=media&token=${token}`;
}
