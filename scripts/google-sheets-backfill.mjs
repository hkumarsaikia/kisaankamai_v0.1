import { parseArgs, printUsage, getStringOption } from "./lib/cli.mjs";
import { loadRepoEnv } from "./lib/env.mjs";
import { getAdminDb } from "./lib/firebase-admin.mjs";
import {
  appendAuditEntry,
  ensureWorkbookStructure,
  getSheetDefinitions,
  getWorkbookManifest,
  replaceSheetRows,
  upsertWorkbookMetaEntries,
} from "./lib/google-sheets.mjs";
import { buildOperationalWorkbookRows, loadOperationalCollections } from "./lib/operational-data.mjs";

const options = parseArgs();

if (options.help) {
  printUsage([
    "Usage: node scripts/google-sheets-backfill.mjs [--sheet-id <id>]",
    "",
    "Backfills the replace-mode operational tabs from Firestore into the canonical workbook.",
    "Auth event and sync audit tabs are preserved because they are sheet-native operational logs.",
  ]);
  process.exit(0);
}

loadRepoEnv();
const spreadsheetId = getStringOption(options, "sheet-id", "");
const overrides = spreadsheetId ? { spreadsheetId } : {};
const runId = `backfill-${Date.now()}`;
const mirroredAt = new Date().toISOString();

await ensureWorkbookStructure(overrides);

const db = getAdminDb();
const collections = await loadOperationalCollections(db);
const workbookData = buildOperationalWorkbookRows(collections, {
  mirroredAt,
  sourceLabel: "firestore-backfill",
});

for (const definition of getSheetDefinitions()) {
  if (definition.backfillMode !== "replace" || definition.key === "workbook_meta") {
    continue;
  }

  const rows = workbookData.rows[definition.key] || [];
  await replaceSheetRows(definition.key, rows, overrides);
}

await upsertWorkbookMetaEntries(
  [
    { section: "contract", key: "source_of_truth", value: getWorkbookManifest().sourceOfTruth, updated_at: mirroredAt },
    { section: "contract", key: "mirror_policy", value: getWorkbookManifest().mirrorPolicy, updated_at: mirroredAt },
    { section: "backfill", key: "last_run_id", value: runId, updated_at: mirroredAt },
    { section: "backfill", key: "last_run_at", value: mirroredAt, updated_at: mirroredAt },
    { section: "backfill", key: "preserved_tabs", value: "auth_events, sync_audit", updated_at: mirroredAt },
    ...Object.entries(workbookData.summary).map(([key, value]) => ({
      section: "counts",
      key,
      value: String(value),
      updated_at: mirroredAt,
    })),
  ],
  overrides
);

await appendAuditEntry(
  {
    recorded_at: mirroredAt,
    run_id: runId,
    entity_type: "workbook",
    entity_id: spreadsheetId || "env:GOOGLE_SHEET_ID",
    destination: "google-sheets",
    outcome: "success",
    operation: "backfill",
    note: "Firestore-backed tabs replaced; auth_events and sync_audit preserved.",
    details_json: JSON.stringify(workbookData.summary),
  },
  overrides
);

console.log(`Backfilled workbook ${spreadsheetId || "(from env)"} at ${mirroredAt}.`);
for (const [key, value] of Object.entries(workbookData.summary)) {
  console.log(`- ${key}: ${value}`);
}
