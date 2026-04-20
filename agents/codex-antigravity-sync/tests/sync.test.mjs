import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import {
  CURRENT_PACK_FILES,
  syncCrossAgentPack,
} from "../runtime/sync.mjs";
import {
  CROSS_AGENT_CURRENT_DIR,
  resolveRepoPath,
} from "../runtime/paths.mjs";

function makeTempRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "cross-agent-sync-"));
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeText(filePath, value) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, value, "utf8");
}

function writeJson(filePath, value) {
  writeText(filePath, JSON.stringify(value, null, 2));
}

function seedCurrentPack(rootDir, extraFiles = {}) {
  const currentDir = resolveRepoPath(rootDir, CROSS_AGENT_CURRENT_DIR);
  ensureDir(currentDir);
  writeText(path.join(currentDir, "summary.md"), "# Existing Summary\n");
  writeText(path.join(currentDir, "task.md"), "# Existing Task\n");
  writeText(
    path.join(currentDir, "automation-state.json"),
    JSON.stringify(
      {
        version: 2,
        tools: {
          codex: { initialized: false, firstRunAt: null, lastRunAt: null, lastScanMode: null },
          antigravity: { initialized: false, firstRunAt: null, lastRunAt: null, lastScanMode: null },
        },
      },
      null,
      2
    )
  );

  for (const [fileName, fileContents] of Object.entries(extraFiles)) {
    writeText(path.join(currentDir, fileName), fileContents);
  }
}

function seedCodexSurface(codexHome, sessionId, threadName, transcriptText) {
  const sessionIndexPath = path.join(codexHome, "session_index.jsonl");
  const sessionDir = path.join(codexHome, "sessions", "2026", "04", "19");
  const sessionPath = path.join(sessionDir, `rollout-2026-04-19T10-00-00-${sessionId}.jsonl`);

  ensureDir(sessionDir);

  writeText(
    sessionIndexPath,
    JSON.stringify({
      id: sessionId,
      thread_name: threadName,
      updated_at: "2026-04-19T10:00:00.000Z",
    }) + "\n"
  );

  writeText(
    sessionPath,
    [
      JSON.stringify({
        timestamp: "2026-04-19T10:00:00.000Z",
        type: "session_meta",
        payload: { id: sessionId },
      }),
      JSON.stringify({
        timestamp: "2026-04-19T10:00:01.000Z",
        type: "response_item",
        payload: {
          type: "message",
          role: "user",
          content: [{ type: "input_text", text: transcriptText }],
        },
      }),
    ].join("\n") + "\n"
  );

  return sessionPath;
}

function seedAntigravitySurface(antigravityHome, conversationId, options = {}) {
  const brainDir = path.join(antigravityHome, "brain", conversationId);
  const conversationsDir = path.join(antigravityHome, "conversations");
  const annotationsDir = path.join(antigravityHome, "annotations");
  const pbPath = path.join(conversationsDir, `${conversationId}.pb`);
  const annotationPath = path.join(annotationsDir, `${conversationId}.pbtxt`);

  ensureDir(brainDir);
  ensureDir(conversationsDir);
  ensureDir(annotationsDir);

  writeText(path.join(brainDir, "task.md"), "# Task\n- Investigate agent drift.\n");
  writeText(path.join(brainDir, "walkthrough.md"), "# Walkthrough\n- Reviewed the current state.\n");

  if (options.invalidMetadata) {
    writeText(path.join(brainDir, "task.md.metadata.json"), "{not valid json");
  } else {
    writeJson(path.join(brainDir, "task.md.metadata.json"), {
      artifactType: "ARTIFACT_TYPE_TASK",
      summary: "Investigate agent drift",
      updatedAt: "2026-04-19T10:00:00.000Z",
      version: "1",
    });
  }

  fs.writeFileSync(pbPath, Buffer.from([0x47, 0x0e, 0x7b, 0x74, 0x89, 0x6e]));
  writeText(annotationPath, "last_user_view_time { seconds:1713500000 nanos:0 }\n");

  return { brainDir, pbPath, annotationPath };
}

test("syncCrossAgentPack deduplicates current and explicit Antigravity references into one normalized source", () => {
  const rootDir = makeTempRoot();
  const antigravityHome = path.join(rootDir, ".antigravity-home");
  const conversationId = "2798d2cc-6523-494c-a05c-74b020ae0dcd";
  const { brainDir, pbPath } = seedAntigravitySurface(antigravityHome, conversationId);

  const result = syncCrossAgentPack({
    rootDir,
    currentTool: "antigravity",
    antigravityHome,
    currentConversation: {
      conversationId,
      transcriptContent: "live antigravity conversation transcript",
    },
    includeReferences: [conversationId, brainDir, pbPath, brainDir],
    fullScan: true,
    now: new Date("2026-04-19T06:27:08.000Z"),
  });

  const conversationSources = JSON.parse(fs.readFileSync(result.conversationSourcesPath, "utf8"));
  const transcriptOutput = fs.readFileSync(path.join(result.currentDir, "transcript.md"), "utf8");
  const provenanceOutput = fs.readFileSync(path.join(result.currentDir, "provenance.md"), "utf8");

  assert.equal(conversationSources.version, 2);
  assert.equal(conversationSources.sources.length, 1);
  assert.equal(conversationSources.sources[0].role, "current");
  assert.equal(conversationSources.sources[0].tool, "antigravity");
  assert.equal(conversationSources.sources[0].status, "ok");
  assert.equal(conversationSources.duplicatesRemoved.length, 4);
  assert.match(conversationSources.duplicatesRemoved[0].reason, /duplicate_of_current_source/);
  assert.ok(Object.hasOwn(conversationSources.sources[0], "canonicalKey"));
  assert.ok(Object.hasOwn(conversationSources.sources[0], "persistedSources"));
  assert.ok(Object.hasOwn(conversationSources.sources[0], "artifacts"));
  assert.ok(Object.hasOwn(conversationSources.sources[0], "warnings"));
  assert.match(transcriptOutput, /Current Conversation/);
  assert.doesNotMatch(transcriptOutput, /Referenced Conversation 1/);
  assert.match(provenanceOutput, /Duplicates Removed/);
});

test("syncCrossAgentPack surfaces malformed automation state and missing Codex SQLite as explicit warnings", () => {
  const rootDir = makeTempRoot();
  const codexHome = path.join(rootDir, ".codex-home");
  const sessionId = "019da4a5-79aa-77d2-a87a-51ee610c3d0a";
  seedCurrentPack(rootDir, {
    "automation-state.json": "{not valid json",
  });
  seedCodexSurface(codexHome, sessionId, "Inspect conversation refs", "persisted codex transcript");

  const result = syncCrossAgentPack({
    rootDir,
    currentTool: "codex",
    codexHome,
    currentConversation: {
      conversationId: sessionId,
      threadTitle: "Inspect conversation refs",
      transcriptContent: "live codex conversation transcript",
    },
    now: new Date("2026-04-19T06:07:08.000Z"),
  });

  const conversationSources = JSON.parse(fs.readFileSync(result.conversationSourcesPath, "utf8"));

  assert.equal(result.scanMode, "full_scan");
  assert.equal(conversationSources.sources[0].tool, "codex");
  assert.equal(conversationSources.sources[0].status, "partial");
  assert.ok(result.warnings.some((warning) => warning.code === "automation-state-invalid"));
  assert.ok(conversationSources.sources[0].warnings.some((warning) => warning.code === "sqlite-missing"));
});

test("syncCrossAgentPack defaults later Codex runs to incremental refresh", () => {
  const rootDir = makeTempRoot();
  const codexHome = path.join(rootDir, ".codex-home");
  const sessionId = "019da4a5-79aa-77d2-a87a-51ee610c3d0a";
  seedCodexSurface(codexHome, sessionId, "Inspect conversation refs", "persisted codex transcript");

  syncCrossAgentPack({
    rootDir,
    currentTool: "codex",
    codexHome,
    currentConversation: {
      conversationId: sessionId,
      threadTitle: "Inspect conversation refs",
      transcriptContent: "first live codex conversation transcript",
    },
    now: new Date("2026-04-19T06:07:08.000Z"),
  });

  const result = syncCrossAgentPack({
    rootDir,
    currentTool: "codex",
    codexHome,
    currentConversation: {
      conversationId: sessionId,
      threadTitle: "Inspect conversation refs",
      transcriptContent: "second live codex conversation transcript",
    },
    now: new Date("2026-04-19T06:17:08.000Z"),
  });

  const automationState = JSON.parse(fs.readFileSync(result.automationStatePath, "utf8"));
  assert.equal(result.scanMode, "incremental");
  assert.equal(automationState.tools.codex.lastScanMode, "incremental");
});

test("syncCrossAgentPack normalizes legacy automation-state versions to the v2 schema", () => {
  const rootDir = makeTempRoot();
  const codexHome = path.join(rootDir, ".codex-home");
  const currentDir = resolveRepoPath(rootDir, CROSS_AGENT_CURRENT_DIR);
  const sessionId = "019da4a5-79aa-77d2-a87a-51ee610c3d0a";

  ensureDir(currentDir);
  writeJson(path.join(currentDir, "automation-state.json"), {
    version: 1,
    tools: {
      codex: { initialized: true, firstRunAt: "2026-04-19T06:00:00.000Z", lastRunAt: "2026-04-19T06:00:00.000Z", lastScanMode: "full_scan" },
      antigravity: { initialized: false, firstRunAt: null, lastRunAt: null, lastScanMode: null },
    },
  });
  seedCodexSurface(codexHome, sessionId, "Inspect conversation refs", "persisted codex transcript");

  const result = syncCrossAgentPack({
    rootDir,
    currentTool: "codex",
    codexHome,
    currentConversation: {
      conversationId: sessionId,
      threadTitle: "Inspect conversation refs",
      transcriptContent: "live codex conversation transcript",
    },
    now: new Date("2026-04-19T06:27:08.000Z"),
  });

  const automationState = JSON.parse(fs.readFileSync(result.automationStatePath, "utf8"));
  assert.equal(automationState.version, 2);
});

test("syncCrossAgentPack supports dry-run without mutating the current pack", () => {
  const rootDir = makeTempRoot();
  const codexHome = path.join(rootDir, ".codex-home");
  const currentDir = resolveRepoPath(rootDir, CROSS_AGENT_CURRENT_DIR);
  const sessionId = "019da4a5-79aa-77d2-a87a-51ee610c3d0a";
  seedCurrentPack(rootDir);
  seedCodexSurface(codexHome, sessionId, "Inspect conversation refs", "persisted codex transcript");

  const beforeSummary = fs.readFileSync(path.join(currentDir, "summary.md"), "utf8");
  const result = syncCrossAgentPack({
    rootDir,
    currentTool: "codex",
    codexHome,
    currentConversation: {
      conversationId: sessionId,
      threadTitle: "Inspect conversation refs",
      transcriptContent: "live codex conversation transcript",
    },
    dryRun: true,
    now: new Date("2026-04-19T06:27:08.000Z"),
  });
  const afterSummary = fs.readFileSync(path.join(currentDir, "summary.md"), "utf8");

  assert.equal(result.dryRun, true);
  assert.equal(result.archiveDir, null);
  assert.ok(result.previewArchiveDir);
  assert.equal(beforeSummary, afterSummary);
  assert.equal(result.fileContentsByName["summary.md"].includes("Last refresh"), true);
});

test("syncCrossAgentPack records malformed Antigravity metadata as warnings instead of failing", () => {
  const rootDir = makeTempRoot();
  const antigravityHome = path.join(rootDir, ".antigravity-home");
  const conversationId = "2798d2cc-6523-494c-a05c-74b020ae0dcd";
  seedAntigravitySurface(antigravityHome, conversationId, { invalidMetadata: true });

  const result = syncCrossAgentPack({
    rootDir,
    currentTool: "antigravity",
    antigravityHome,
    currentConversation: {
      conversationId,
      transcriptContent: "live antigravity conversation transcript",
    },
    now: new Date("2026-04-19T06:37:08.000Z"),
  });

  const conversationSources = JSON.parse(fs.readFileSync(result.conversationSourcesPath, "utf8"));
  const currentSource = conversationSources.sources.find((source) => source.role === "current");

  assert.equal(currentSource.status, "partial");
  assert.ok(currentSource.warnings.some((warning) => warning.code === "antigravity-metadata-invalid"));
});

test("syncCrossAgentPack always writes the full normalized current pack file set", () => {
  const rootDir = makeTempRoot();
  const codexHome = path.join(rootDir, ".codex-home");
  const sessionId = "019da4a5-79aa-77d2-a87a-51ee610c3d0a";
  seedCodexSurface(codexHome, sessionId, "Inspect conversation refs", "persisted codex transcript");

  const result = syncCrossAgentPack({
    rootDir,
    currentTool: "codex",
    codexHome,
    currentConversation: {
      conversationId: sessionId,
      threadTitle: "Inspect conversation refs",
      transcriptContent: "live codex conversation transcript",
    },
    now: new Date("2026-04-19T06:47:08.000Z"),
  });

  for (const fileName of CURRENT_PACK_FILES) {
    assert.equal(fs.existsSync(path.join(result.currentDir, fileName)), true, `${fileName} should exist`);
  }
});
