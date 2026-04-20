import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";

const LEGACY_ROOT_RUNTIME_FILES = [
  ".cloudflared-tunnel.err.log",
  ".cloudflared-tunnel.out.log",
  ".cloudflared-tunnel.pid",
  ".codex-dev.err.log",
  ".codex-dev.out.log",
  ".codex-dev2.err.log",
  ".codex-dev2.out.log",
  ".codex-verify-dev.out.log",
  ".codex-verify-dev.pid",
];

test("repo-managed runtime scripts write logs under dedicated runtime folders", async () => {
  const [nextLogsSource, publicTunnelSource] = await Promise.all([
    readFile(new URL("../scripts/run-next-with-logs.mjs", import.meta.url), "utf8"),
    readFile(new URL("../scripts/public-tunnel.mjs", import.meta.url), "utf8"),
  ]);

  assert.match(nextLogsSource, /logs["',\\\/]+runtime["',\\\/]+dev/);
  assert.match(publicTunnelSource, /logs["',\\\/]+runtime["',\\\/]+tunnel/);
  assert.doesNotMatch(publicTunnelSource, /path\.join\(ROOT_DIR,\s*"tunnel\.log"\)/);
});

test("legacy root runtime files are no longer left in the repo root", () => {
  for (const file of LEGACY_ROOT_RUNTIME_FILES) {
    assert.equal(existsSync(new URL(`../${file}`, import.meta.url)), false, `${file} should be moved out of the repo root`);
  }
});
