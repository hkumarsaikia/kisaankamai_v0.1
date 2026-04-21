import fs from "node:fs";
import path from "node:path";
import { parseArgs, printUsage, getBooleanOption } from "./lib/cli.mjs";
import { getRepoRoot, loadRepoEnv } from "./lib/env.mjs";
import { getAdminAuth, getAdminDb } from "./lib/firebase-admin.mjs";
import { cleanupFinalTestAccounts } from "./lib/final-test-accounts.mjs";

const options = parseArgs();

if (options.help) {
  printUsage([
    "Usage: node scripts/final-test-accounts-cleanup.mjs [--dry-run]",
    "",
    "Deletes the two final test accounts plus the seeded listings, bookings, payments, and saved items tied to them.",
  ]);
  process.exit(0);
}

loadRepoEnv();
const dryRun = getBooleanOption(options, "dry-run", false);

const summary = await cleanupFinalTestAccounts({
  db: getAdminDb(),
  auth: getAdminAuth(),
  dryRun,
});

console.log(dryRun ? "Dry-run final test account cleanup plan:" : "Cleaned up final test accounts:");
for (const [key, value] of Object.entries(summary.deleted)) {
  console.log(`- ${key}: ${value}`);
}

const runtimeDir = path.join(getRepoRoot(), "logs", "runtime", "final-test-accounts");
fs.mkdirSync(runtimeDir, { recursive: true });
fs.writeFileSync(
  path.join(runtimeDir, dryRun ? "latest-cleanup-dry-run.json" : "latest-cleanup.json"),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      dryRun,
      summary,
    },
    null,
    2
  ),
  "utf8"
);
