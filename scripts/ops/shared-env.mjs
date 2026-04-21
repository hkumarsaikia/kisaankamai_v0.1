import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const repoRoot = path.resolve(__dirname, "..", "..");

const APPHOSTING_OVERRIDE_KEYS = new Set([
  "GOOGLE_SHEET_ID",
  "NEXT_PUBLIC_SITE_URL",
  "FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
  "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID",
]);

let envLoaded = false;

function normalizeEnvValue(rawValue) {
  const trimmed = rawValue.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

async function loadDotEnvFile() {
  const envPath = path.join(repoRoot, ".env.local");
  try {
    const content = await fs.readFile(envPath, "utf8");
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }

      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex === -1) {
        continue;
      }

      const key = trimmed.slice(0, separatorIndex).trim();
      const value = normalizeEnvValue(trimmed.slice(separatorIndex + 1));
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch (error) {
    if (error?.code !== "ENOENT") {
      throw error;
    }
  }
}

async function loadAppHostingValues() {
  const appHostingPath = path.join(repoRoot, "apphosting.yaml");
  try {
    const content = await fs.readFile(appHostingPath, "utf8");
    const values = new Map();
    let currentVariable = "";

    for (const line of content.split(/\r?\n/)) {
      const variableMatch = line.match(/^\s*-\s+variable:\s+(.+?)\s*$/);
      if (variableMatch) {
        currentVariable = variableMatch[1].trim();
        continue;
      }

      if (!currentVariable) {
        continue;
      }

      const valueMatch = line.match(/^\s+value:\s+(.+?)\s*$/);
      if (valueMatch) {
        values.set(currentVariable, normalizeEnvValue(valueMatch[1]));
        currentVariable = "";
        continue;
      }

      const secretMatch = line.match(/^\s+secret:\s+(.+?)\s*$/);
      if (secretMatch) {
        currentVariable = "";
      }
    }

    return values;
  } catch (error) {
    if (error?.code === "ENOENT") {
      return new Map();
    }

    throw error;
  }
}

export async function loadRuntimeEnv() {
  if (envLoaded) {
    return;
  }

  await loadDotEnvFile();
  const appHostingValues = await loadAppHostingValues();

  for (const [key, value] of appHostingValues.entries()) {
    if (APPHOSTING_OVERRIDE_KEYS.has(key) || !process.env[key]) {
      process.env[key] = value;
    }
  }

  envLoaded = true;
}

export function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function resolveFromRoot(...segments) {
  return path.join(repoRoot, ...segments);
}

export async function ensureDirectory(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

export async function writeJsonFile(filePath, payload) {
  await ensureDirectory(path.dirname(filePath));
  await fs.writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}
