import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const THIS_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(THIS_DIR, "..", "..");
const DEFAULT_ENV_FILES = [".env.local", ".env"];
const APPHOSTING_ENV_OVERRIDES = [
  "GOOGLE_SHEET_ID",
  "FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_SITE_URL",
];

export function getRepoRoot() {
  return REPO_ROOT;
}

export function loadRepoEnv(files = DEFAULT_ENV_FILES) {
  const loaded = [];

  for (const relativePath of files) {
    const absolutePath = path.join(REPO_ROOT, relativePath);
    if (!fs.existsSync(absolutePath)) {
      continue;
    }

    process.loadEnvFile(absolutePath);
    loaded.push(relativePath);
  }

  applyAppHostingEnvOverrides();
  return loaded;
}

function parseAppHostingEnv() {
  const appHostingPath = path.join(REPO_ROOT, "apphosting.yaml");
  if (!fs.existsSync(appHostingPath)) {
    return new Map();
  }

  const source = fs.readFileSync(appHostingPath, "utf8");
  const matches = source.matchAll(
    /-\s+variable:\s*([A-Z0-9_]+)\s*\r?\n\s+(?:value:\s*([^\r\n#]+)|secret:\s*([^\r\n#]+))/g
  );
  const values = new Map();

  for (const match of matches) {
    const [, key, value, secret] = match;
    if (value?.trim()) {
      values.set(key.trim(), value.trim().replace(/^["']|["']$/g, ""));
      continue;
    }

    if (secret?.trim()) {
      values.set(key.trim(), `secret:${secret.trim()}`);
    }
  }

  return values;
}

function applyAppHostingEnvOverrides() {
  const appHostingEnv = parseAppHostingEnv();
  for (const key of APPHOSTING_ENV_OVERRIDES) {
    const value = appHostingEnv.get(key);
    if (!value || value.startsWith("secret:")) {
      continue;
    }

    process.env[key] = value;
  }
}

export function requireEnv(name, fallback) {
  const value = process.env[name] || fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getGoogleSheetConfig(overrides = {}) {
  const spreadsheetId = overrides.spreadsheetId || process.env.GOOGLE_SHEET_ID || "";
  const clientEmail =
    overrides.clientEmail || process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || process.env.FIREBASE_CLIENT_EMAIL || "";
  const rawPrivateKey =
    overrides.privateKey || process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY || "";
  const privateKey = rawPrivateKey ? rawPrivateKey.replace(/\\n/g, "\n") : "";

  return {
    spreadsheetId,
    clientEmail,
    privateKey,
  };
}

export function getFirebaseAdminConfig() {
  const projectId =
    process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "gokisaan";
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || "";
  const privateKey = (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n");
  const storageBucket =
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "gokisaan.firebasestorage.app";

  return {
    projectId,
    clientEmail,
    privateKey,
    storageBucket,
  };
}

export function isSheetsConfigured(overrides = {}) {
  const config = getGoogleSheetConfig(overrides);
  return Boolean(config.spreadsheetId && config.clientEmail && config.privateKey);
}
