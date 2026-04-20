import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { getCrossAgentStatus, parseCliArgs } from "../runtime/sync.mjs";
import { CROSS_AGENT_CURRENT_DIR, resolveRepoPath } from "../runtime/paths.mjs";

function makeTempRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "cross-agent-cli-"));
}

test("parseCliArgs rejects unknown flags and missing values", () => {
  assert.throws(() => parseCliArgs(["--nope"]), /Unknown flag/i);
  assert.throws(() => parseCliArgs(["--tool"]), /Missing value for --tool/i);
  assert.throws(() => parseCliArgs(["--tool", "bad-tool"]), /Unknown tool/i);
});

test("parseCliArgs validates current transcript file paths", () => {
  assert.throws(
    () => parseCliArgs(["--current-transcript-file", "C:\\does-not-exist.txt"]),
    /Current transcript file does not exist/i
  );
});

test("getCrossAgentStatus is read-only and reports malformed current state warnings", () => {
  const rootDir = makeTempRoot();
  const currentDir = resolveRepoPath(rootDir, CROSS_AGENT_CURRENT_DIR);
  fs.mkdirSync(currentDir, { recursive: true });
  fs.writeFileSync(path.join(currentDir, "automation-state.json"), "{bad", "utf8");
  fs.writeFileSync(path.join(currentDir, "conversation-sources.json"), "{bad", "utf8");

  const status = getCrossAgentStatus({ rootDir });

  assert.equal(status.currentPackExists, true);
  assert.ok(status.warnings.some((warning) => warning.code === "automation-state-invalid"));
  assert.ok(status.warnings.some((warning) => warning.code === "conversation-sources-invalid"));
});
