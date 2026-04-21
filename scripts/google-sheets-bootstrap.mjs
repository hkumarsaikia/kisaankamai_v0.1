import { parseArgs, printUsage, getStringOption } from "./lib/cli.mjs";
import { loadRepoEnv, getRepoRoot } from "./lib/env.mjs";
import {
  appendAuditEntry,
  ensureWorkbookStructure,
  getWorkbookManifest,
  upsertWorkbookMetaEntries,
} from "./lib/google-sheets.mjs";

const options = parseArgs();

if (options.help) {
  printUsage([
    "Usage: node scripts/google-sheets-bootstrap.mjs [--sheet-id <id>]",
    "",
    "Bootstraps the operational workbook structure, headers, formatting, and workbook metadata.",
  ]);
  process.exit(0);
}

const envFiles = loadRepoEnv();
const spreadsheetId = getStringOption(options, "sheet-id", "");
const overrides = spreadsheetId ? { spreadsheetId } : {};
const runId = `bootstrap-${Date.now()}`;
const timestamp = new Date().toISOString();

await ensureWorkbookStructure(overrides);
await upsertWorkbookMetaEntries(
  [
    { section: "contract", key: "source_of_truth", value: getWorkbookManifest().sourceOfTruth, updated_at: timestamp },
    { section: "contract", key: "mirror_policy", value: getWorkbookManifest().mirrorPolicy, updated_at: timestamp },
    { section: "workbook", key: "version", value: String(getWorkbookManifest().version), updated_at: timestamp },
    { section: "bootstrap", key: "last_run_id", value: runId, updated_at: timestamp },
    { section: "bootstrap", key: "last_run_at", value: timestamp, updated_at: timestamp },
    { section: "bootstrap", key: "repo_root", value: getRepoRoot(), updated_at: timestamp },
    { section: "bootstrap", key: "env_files_loaded", value: envFiles.join(", ") || "none", updated_at: timestamp },
  ],
  overrides
);
await appendAuditEntry(
  {
    recorded_at: timestamp,
    run_id: runId,
    entity_type: "workbook",
    entity_id: spreadsheetId || "env:GOOGLE_SHEET_ID",
    destination: "google-sheets",
    outcome: "success",
    operation: "bootstrap",
    note: "Workbook structure, filters, conditional formatting, and headers applied.",
    details_json: JSON.stringify({
      version: getWorkbookManifest().version,
      sheetCount: getWorkbookManifest().sheets.length,
    }),
  },
  overrides
);

console.log(`Bootstrapped Google Sheets workbook ${spreadsheetId || "(from env)"} with ${getWorkbookManifest().sheets.length} tabs.`);
