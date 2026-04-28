import { parseArgs, printUsage, getBooleanOption, getNumberOption } from "./lib/cli.mjs";
import { loadRepoEnv } from "./lib/env.mjs";
import { getAdminAuth, getAdminDb } from "./lib/firebase-admin.mjs";

const options = parseArgs();

if (options.help) {
  printUsage([
    "Usage: node scripts/repair-password-login-emails.mjs [--apply] [--limit <count>]",
    "",
    "Repairs users.passwordLoginEmail from Firebase Auth email/password users resolved by phone.",
    "Default mode is dry-run. Use --apply to write the repair.",
  ]);
  process.exit(0);
}

loadRepoEnv();

const apply = getBooleanOption(options, "apply", false);
const dryRun = !apply || getBooleanOption(options, "dry-run", false);
const limit = Math.max(0, Math.floor(getNumberOption(options, "limit", 0)));
const auth = getAdminAuth();
const db = getAdminDb();
const timestamp = new Date().toISOString();

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizePhone(value) {
  return String(value || "").replace(/\D/g, "").slice(-10);
}

function toE164Phone(value) {
  const phone = normalizePhone(value);
  return phone.length === 10 ? `+91${phone}` : "";
}

function hasPasswordProvider(authUser) {
  return (authUser.providerData || []).some((provider) => provider.providerId === "password");
}

function redactEmail(email) {
  const normalized = normalizeEmail(email);
  const [local, domain] = normalized.split("@");
  if (!local || !domain) {
    return "";
  }

  return `${local.slice(0, 2)}***@${domain}`;
}

function redactPhone(phone) {
  const normalized = normalizePhone(phone);
  return normalized ? `******${normalized.slice(-4)}` : "";
}

function redactUserId(userId) {
  return `${String(userId || "").slice(0, 8)}...`;
}

async function getAuthUserByDocOrPhone(userId, phone) {
  const authById = await auth.getUser(userId).catch(() => null);
  if (authById) {
    return authById;
  }

  const e164Phone = toE164Phone(phone);
  if (!e164Phone) {
    return null;
  }

  return auth.getUserByPhoneNumber(e164Phone).catch(() => null);
}

const counters = {
  scanned: 0,
  repairable: 0,
  updated: 0,
  unchanged: 0,
  skippedNoPhone: 0,
  skippedNoAuth: 0,
  skippedNoPasswordProvider: 0,
};
const examples = [];

const snapshot = await db.collection("users").get();

for (const doc of snapshot.docs) {
  if (limit && counters.scanned >= limit) {
    break;
  }

  counters.scanned += 1;
  const data = doc.data() || {};
  const phone = normalizePhone(data.phone);

  if (!phone) {
    counters.skippedNoPhone += 1;
    continue;
  }

  const authUser = await getAuthUserByDocOrPhone(doc.id, phone);
  if (!authUser) {
    counters.skippedNoAuth += 1;
    continue;
  }

  const authEmail = normalizeEmail(authUser.email);
  if (!authEmail || !hasPasswordProvider(authUser)) {
    counters.skippedNoPasswordProvider += 1;
    continue;
  }

  const currentEmail = normalizeEmail(data.passwordLoginEmail);
  if (currentEmail === authEmail) {
    counters.unchanged += 1;
    continue;
  }

  counters.repairable += 1;
  if (examples.length < 10) {
    examples.push({
      userId: redactUserId(doc.id),
      phone: redactPhone(phone),
      from: currentEmail ? redactEmail(currentEmail) : "empty",
      to: redactEmail(authEmail),
    });
  }

  if (!dryRun) {
    await doc.ref.set(
      {
        passwordLoginEmail: authEmail,
        updatedAt: timestamp,
      },
      { merge: true }
    );
    counters.updated += 1;
  }
}

console.log(dryRun ? "Password login email repair dry-run:" : "Password login email repair applied:");
for (const [key, value] of Object.entries(counters)) {
  console.log(`- ${key}: ${value}`);
}

if (examples.length) {
  console.log("- examples:");
  for (const example of examples) {
    console.log(`  - ${example.userId} ${example.phone}: ${example.from} -> ${example.to}`);
  }
}
