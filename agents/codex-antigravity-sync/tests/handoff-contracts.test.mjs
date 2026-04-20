import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import { existsSync } from "node:fs";
import { mkdtemp, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { utimes } from "node:fs/promises";

import { syncCrossAgentPack } from "../runtime/sync.mjs";
import { CROSS_AGENT_CURRENT_DIR, resolveRepoPath } from "../runtime/paths.mjs";

const REQUIRED_CURRENT_FILES = [
  "summary.md",
  "task.md",
  "decisions.md",
  "files.md",
  "status.md",
  "transcript.md",
  "provenance.md",
  "automation-state.json",
  "conversation-sources.json",
];

async function makeTempRoot() {
  return mkdtemp(path.join(os.tmpdir(), "cross-agent-handoff-"));
}

async function seedCurrentPack(rootDir) {
  const currentDir = resolveRepoPath(rootDir, CROSS_AGENT_CURRENT_DIR);
  const archiveDir = path.join(rootDir, "agents", "codex-antigravity-sync", "state", "archive");
  await mkdir(currentDir, { recursive: true });
  await mkdir(archiveDir, { recursive: true });

  await Promise.all(
    REQUIRED_CURRENT_FILES.map((name) =>
      writeFile(path.join(currentDir, name), `seed:${name}\n`, "utf8")
    )
  );
}

async function writeConfig(rootDir, value) {
  const configDir = path.join(rootDir, "agents", "codex-antigravity-sync", "config");
  await mkdir(configDir, { recursive: true });
  await writeFile(path.join(configDir, "local.json"), JSON.stringify(value, null, 2), "utf8");
}

test("manual external sync fails clearly when the removable local config is missing", async () => {
  const rootDir = await makeTempRoot();
  assert.throws(() => syncCrossAgentPack({ rootDir }), /Missing cross-agent local config/i);
});

test("manual external sync archives the previous current pack and imports the newest transcript export", async () => {
  const rootDir = await makeTempRoot();
  const transcriptDropFolder = path.join(rootDir, "external-transcripts");

  await seedCurrentPack(rootDir);
  await mkdir(transcriptDropFolder, { recursive: true });

  const olderTranscriptPath = path.join(transcriptDropFolder, "2026-04-18-codex.md");
  const newerTranscriptPath = path.join(transcriptDropFolder, "2026-04-19-antigravity.md");

  await writeFile(olderTranscriptPath, "# older transcript\n", "utf8");
  await writeFile(newerTranscriptPath, "# newer transcript\n", "utf8");

  const olderTime = new Date("2026-04-18T12:00:00.000Z");
  const newerTime = new Date("2026-04-19T12:00:00.000Z");
  await Promise.all([
    writeConfig(rootDir, {
      transcriptDropFolder,
      transcriptExtensions: [".md"],
    }),
    utimes(olderTranscriptPath, olderTime, olderTime),
    utimes(newerTranscriptPath, newerTime, newerTime),
  ]);

  const result = syncCrossAgentPack({
    rootDir,
    now: new Date("2026-04-19T13:45:30.000Z"),
  });

  assert.match(result.archiveDir, /20260419-134530-2026-04-19-antigravity/i);

  const currentTranscript = await readFile(
    path.join(rootDir, "agents", "codex-antigravity-sync", "state", "current", "transcript.md"),
    "utf8"
  );
  assert.match(currentTranscript, /2026-04-19-antigravity\.md/);
  assert.match(currentTranscript, /# newer transcript/);

  const currentFiles = await readdir(path.join(rootDir, "agents", "codex-antigravity-sync", "state", "current"));
  for (const requiredFile of REQUIRED_CURRENT_FILES) {
    assert.equal(currentFiles.includes(requiredFile), true, `${requiredFile} should exist in the refreshed pack`);
  }
});

test("repo exposes the new cross-agent subtree entrypoints and removable local config pattern", async () => {
  const [packageJson, gitignore] = await Promise.all([
    readFile(new URL("../../../package.json", import.meta.url), "utf8"),
    readFile(new URL("../../../.gitignore", import.meta.url), "utf8"),
  ]);

  assert.match(
    packageJson,
    /"cross-agent:sync"\s*:\s*"node agents\/codex-antigravity-sync\/runtime\/sync\.mjs"/
  );
  assert.match(
    packageJson,
    /"cross-agent:install"\s*:\s*"node agents\/codex-antigravity-sync\/runtime\/install\.mjs"/
  );
  assert.match(
    packageJson,
    /"cross-agent:remove"\s*:\s*"node agents\/codex-antigravity-sync\/runtime\/remove\.mjs"/
  );
  assert.match(gitignore, /^agents\/codex-antigravity-sync\/config\/local\.json$/m);
  assert.equal(existsSync(new URL("../docs/README.md", import.meta.url)), true);
  assert.equal(existsSync(new URL("../docs/UPDATER.md", import.meta.url)), true);
  assert.equal(existsSync(new URL("../docs/CONSUMER.md", import.meta.url)), true);
  assert.equal(existsSync(new URL("../docs/REMOVE.md", import.meta.url)), true);
  assert.equal(existsSync(new URL("../docs/REFERENCES.md", import.meta.url)), true);
});

test("external config rejects unknown keys", async () => {
  const rootDir = await makeTempRoot();
  const transcriptDropFolder = path.join(rootDir, "external-transcripts");
  await mkdir(transcriptDropFolder, { recursive: true });
  await writeFile(path.join(transcriptDropFolder, "2026-04-19.md"), "# transcript\n", "utf8");
  await writeConfig(rootDir, {
    transcriptDropFolder,
    allowedExtensions: [".md"],
  });

  assert.throws(() => syncCrossAgentPack({ rootDir }), /unknown keys/i);
});
