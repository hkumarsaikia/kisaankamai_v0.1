import fs from "node:fs";
import path from "node:path";
import { parseArgs, printUsage, getBooleanOption, getStringOption } from "./lib/cli.mjs";
import { getRepoRoot, loadRepoEnv } from "./lib/env.mjs";
import { getAdminAuth, getAdminDb } from "./lib/firebase-admin.mjs";
import { getFinalTestManifest, seedFinalTestAccounts } from "./lib/final-test-accounts.mjs";

const options = parseArgs();

if (options.help) {
  printUsage([
    "Usage: node scripts/final-test-accounts-seed.mjs [--owner-password <password>] [--renter-password <password>] [--dry-run]",
    "",
    "Seeds the two deletable final test accounts and consolidates fixture listings, bookings, payments, and saved items under them.",
    "Fallback env vars: KK_FINAL_TEST_OWNER_PASSWORD, KK_FINAL_TEST_RENTER_PASSWORD",
  ]);
  process.exit(0);
}

loadRepoEnv();

const ownerPassword = getStringOption(options, "owner-password", process.env.KK_FINAL_TEST_OWNER_PASSWORD || "");
const renterPassword = getStringOption(options, "renter-password", process.env.KK_FINAL_TEST_RENTER_PASSWORD || "");
const dryRun = getBooleanOption(options, "dry-run", false);
const manifest = getFinalTestManifest();

const summary = await seedFinalTestAccounts({
  db: getAdminDb(),
  auth: getAdminAuth(),
  ownerPassword,
  renterPassword,
  dryRun,
});

console.log(dryRun ? "Dry-run final test account seed plan:" : "Seeded final test accounts:");
for (const [key, value] of Object.entries(summary)) {
  if (key === "skippedPayments") {
    continue;
  }
  console.log(`- ${key}: ${value}`);
}

if (Array.isArray(summary.skippedPayments) && summary.skippedPayments.length) {
  console.log("- skippedPayments:");
  for (const payment of summary.skippedPayments) {
    console.log(`  * ${payment.paymentId} (${payment.bookingId}): ${payment.reason}`);
  }
}

const runtimeDir = path.join(getRepoRoot(), "logs", "runtime", "final-test-accounts");
fs.mkdirSync(runtimeDir, { recursive: true });
fs.writeFileSync(
  path.join(runtimeDir, dryRun ? "latest-dry-run.json" : "latest-seed.json"),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      dryRun,
      summary,
      accounts: {
        owner: {
          uid: manifest.owner.uid,
          email: manifest.owner.email,
          phoneE164: `+91${manifest.owner.phone}`,
          otpCode: manifest.owner.otpCode,
          password: ownerPassword || undefined,
        },
        renter: {
          uid: manifest.renter.uid,
          email: manifest.renter.email,
          phoneE164: `+91${manifest.renter.phone}`,
          otpCode: manifest.renter.otpCode,
          password: renterPassword || undefined,
        },
      },
    },
    null,
    2
  ),
  "utf8"
);
