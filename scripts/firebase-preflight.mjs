import fs from "node:fs";
import path from "node:path";
import { getRepoRoot } from "./lib/env.mjs";

const repoRoot = getRepoRoot();
const expectedProjectId = "gokisaan";

function readText(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(readText(relativePath));
}

function collectAppHostingEnv(source) {
  const entries = new Map();
  const matches = source.matchAll(
    /-\s+variable:\s*([A-Z0-9_]+)\s*\r?\n\s+(?:value:\s*([^\r\n#]+)|secret:\s*([^\r\n#]+))/g
  );

  for (const match of matches) {
    const [, name, value, secret] = match;
    entries.set(name.trim(), {
      value: value?.trim().replace(/^["']|["']$/g, "") || "",
      secret: secret?.trim() || "",
    });
  }

  return entries;
}

function requireEntry(entries, name) {
  const entry = entries.get(name);
  if (!entry || (!entry.value && !entry.secret)) {
    throw new Error(`Missing App Hosting env entry: ${name}`);
  }
  return entry;
}

function requireLiteralValue(entries, name, expectedValue) {
  const entry = requireEntry(entries, name);
  if (entry.value !== expectedValue) {
    throw new Error(`Expected ${name} to be ${expectedValue}, got ${entry.value || `secret:${entry.secret}`}`);
  }
}

const firebaseConfig = readJson("firebase.json");
const firebaseRc = readJson(".firebaserc");
const appHostingSource = readText("apphosting.yaml");
const appHostingEnv = collectAppHostingEnv(appHostingSource);

if (firebaseRc.projects?.default !== expectedProjectId) {
  throw new Error(`Expected .firebaserc default project to be ${expectedProjectId}`);
}

if (firebaseConfig.firestore?.rules !== "firebase/firestore.rules") {
  throw new Error("Expected Firestore rules path to be firebase/firestore.rules");
}

if (firebaseConfig.storage?.rules !== "firebase/storage.rules") {
  throw new Error("Expected Storage rules path to be firebase/storage.rules");
}

for (const name of [
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
  "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID",
  "NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY",
  "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
  "GOOGLE_SHEET_ID",
]) {
  requireEntry(appHostingEnv, name);
}

requireLiteralValue(appHostingEnv, "NEXT_PUBLIC_SITE_URL", "https://www.kisankamai.com");
requireLiteralValue(appHostingEnv, "NEXT_PUBLIC_FIREBASE_PROJECT_ID", expectedProjectId);
requireLiteralValue(appHostingEnv, "FIREBASE_PROJECT_ID", expectedProjectId);

console.log("Firebase preflight passed: App Hosting, Firestore, Storage, and project config are present.");
