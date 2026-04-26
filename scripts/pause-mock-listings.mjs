import { parseArgs, printUsage, getBooleanOption } from "./lib/cli.mjs";
import { loadRepoEnv } from "./lib/env.mjs";
import { getAdminDb } from "./lib/firebase-admin.mjs";

export const MOCK_LISTING_IDS = [
  "2",
  "4",
  "5",
  "ft-listing-2",
  "ft-listing-4",
  "ft-listing-5",
];

const options = parseArgs();

if (options.help) {
  printUsage([
    "Usage: node scripts/pause-mock-listings.mjs [--dry-run]",
    "",
    "Marks known legacy demo listing documents as paused so public pages only show live owner listings.",
  ]);
  process.exit(0);
}

loadRepoEnv();

const dryRun = getBooleanOption(options, "dry-run", false);
const db = getAdminDb();
const timestamp = new Date().toISOString();
const results = [];

for (const listingId of MOCK_LISTING_IDS) {
  const ref = db.collection("listings").doc(listingId);
  const snapshot = await ref.get();

  if (!snapshot.exists) {
    results.push({ listingId, status: "missing" });
    continue;
  }

  const currentStatus = snapshot.data()?.status || "active";
  if (currentStatus === "paused") {
    results.push({ listingId, status: "already-paused" });
    continue;
  }

  if (!dryRun) {
    await ref.set(
      {
        status: "paused",
        updatedAt: timestamp,
      },
      { merge: true }
    );
  }

  results.push({
    listingId,
    status: dryRun ? "would-pause" : "paused",
    previousStatus: currentStatus,
  });
}

console.log(dryRun ? "Dry-run mock listing pause plan:" : "Paused known mock listings:");
for (const result of results) {
  console.log(`- ${result.listingId}: ${result.status}`);
}
