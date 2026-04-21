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
const result = await verifyWorkbookStructure(overrides);

console.log(`Workbook verification for ${result.spreadsheetId}: ${result.ok ? "PASS" : "FAIL"}`);
for (const check of result.sheetChecks) {
  console.log(
    `${check.title}: exists=${check.exists} header=${check.headerMatch} frozenRow=${check.frozenRowMatch} filter=${check.filterPresent} conditionalRules=${check.conditionalRuleCount}/${check.expectedConditionalRuleCount}`
  );
}

process.exitCode = result.ok ? 0 : 1;
