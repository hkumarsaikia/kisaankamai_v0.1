import { parseArgs, printUsage, getStringOption } from "./lib/cli.mjs";
import { loadRepoEnv } from "./lib/env.mjs";
import { verifyWorkbookStructure } from "./lib/google-sheets.mjs";

const options = parseArgs();

if (options.help) {
  printUsage([
    "Usage: node scripts/google-sheets-verify.mjs [--sheet-id <id>]",
    "",
    "Verifies that the operational workbook tabs, headers, filters, frozen rows, and conditional rules match the manifest.",
  ]);
  process.exit(0);
}

loadRepoEnv();
const spreadsheetId = getStringOption(options, "sheet-id", "");
const overrides = spreadsheetId ? { spreadsheetId } : {};
const VERIFY_ATTEMPTS = 3;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function verifyWorkbookStructureWithRetry() {
  let lastError;

  for (let attempt = 1; attempt <= VERIFY_ATTEMPTS; attempt += 1) {
    try {
      return await verifyWorkbookStructure(overrides);
    } catch (error) {
      lastError = error;
      if (attempt === VERIFY_ATTEMPTS) {
        break;
      }

      const message = error instanceof Error ? error.message : String(error);
      console.warn(`Workbook verification attempt ${attempt} failed: ${message}`);
      await sleep(attempt * 1500);
    }
  }

  throw lastError;
}

const result = await verifyWorkbookStructureWithRetry();

console.log(`Workbook verification for ${result.spreadsheetId}: ${result.ok ? "PASS" : "FAIL"}`);
for (const check of result.sheetChecks) {
  console.log(
    `${check.title}: exists=${check.exists} header=${check.headerMatch} frozenRow=${check.frozenRowMatch} filter=${check.filterPresent} conditionalRules=${check.conditionalRuleCount}/${check.expectedConditionalRuleCount}`
  );
}

process.exitCode = result.ok ? 0 : 1;
