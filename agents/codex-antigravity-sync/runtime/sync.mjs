import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath, pathToFileURL } from "node:url";

import {
  CROSS_AGENT_AGENT_DIR,
  CROSS_AGENT_ARCHIVE_DIR,
  CROSS_AGENT_CURRENT_DIR,
  CROSS_AGENT_DOCS_DIR,
  CURRENT_PACK_FILES,
  CURRENT_PACK_MARKDOWN_FILES,
  CURRENT_PACK_STATE_FILES,
  DEFAULT_ANTIGRAVITY_HOME,
  DEFAULT_CODEX_HOME,
  DEFAULT_CONFIG_EXAMPLE_FILE,
  DEFAULT_CONFIG_FILE,
  DEFAULT_TRANSCRIPT_EXTENSIONS,
  resolveRepoPath,
  resolveRootDir,
  toRepoRelativePath,
} from "./paths.mjs";

const SCRIPT_BASENAME = path.basename(fileURLToPath(import.meta.url));
const CONFIG_KEYS = new Set(["transcriptDropFolder", "transcriptExtensions"]);
const ALLOWED_TOOLS = new Set(["codex", "antigravity"]);

export {
  CURRENT_PACK_FILES,
  CURRENT_PACK_MARKDOWN_FILES,
  CURRENT_PACK_STATE_FILES,
  DEFAULT_CONFIG_EXAMPLE_FILE,
  DEFAULT_CONFIG_FILE,
};

function ensureDirectory(directoryPath) {
  fs.mkdirSync(directoryPath, { recursive: true });
}

function toIsoString(dateLike) {
  return new Date(dateLike).toISOString();
}

function formatArchiveTimestamp(dateLike) {
  const date = new Date(dateLike);
  const pad = (value) => String(value).padStart(2, "0");

  return [
    date.getUTCFullYear(),
    pad(date.getUTCMonth() + 1),
    pad(date.getUTCDate()),
  ].join("") + `-${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}`;
}

function slugify(value) {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "transcript";
}

function hashBuffer(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function hashText(text) {
  return hashBuffer(Buffer.from(text, "utf8"));
}

function hashFile(filePath) {
  return hashBuffer(fs.readFileSync(filePath));
}

function pushWarning(warnings, code, message, extra = {}) {
  warnings.push({ code, message, ...extra });
}

function normalizeExtension(extension) {
  const normalized = String(extension ?? "").trim().toLowerCase();
  return normalized.startsWith(".") ? normalized : `.${normalized}`;
}

function resolveConfigPath(rootDir, configPath) {
  const configuredPath = configPath ?? DEFAULT_CONFIG_FILE;
  return path.isAbsolute(configuredPath)
    ? configuredPath
    : path.join(resolveRootDir(rootDir), configuredPath);
}

function readJsonFileStrict(jsonPath, label) {
  try {
    return JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  } catch (error) {
    throw new Error(
      `Failed to parse ${label} at ${jsonPath}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

function mergeAutomationState(parsedState) {
  const defaultState = createEmptyAutomationState();

  return {
    ...defaultState,
    ...(parsedState ?? {}),
    version: defaultState.version,
    tools: {
      ...defaultState.tools,
      ...(parsedState?.tools ?? {}),
      codex: {
        ...defaultState.tools.codex,
        ...(parsedState?.tools?.codex ?? {}),
      },
      antigravity: {
        ...defaultState.tools.antigravity,
        ...(parsedState?.tools?.antigravity ?? {}),
      },
    },
  };
}

export function loadCrossAgentConfig({
  rootDir = process.cwd(),
  configPath,
  required = false,
} = {}) {
  const resolvedRootDir = resolveRootDir(rootDir);
  const resolvedConfigPath = resolveConfigPath(resolvedRootDir, configPath);

  if (!fs.existsSync(resolvedConfigPath)) {
    if (!required) {
      return null;
    }

    throw new Error(
      `Missing cross-agent local config at ${resolvedConfigPath}. Copy ${DEFAULT_CONFIG_EXAMPLE_FILE} to ${DEFAULT_CONFIG_FILE} and set "transcriptDropFolder" before running the sync utility.`
    );
  }

  const parsedConfig = readJsonFileStrict(resolvedConfigPath, "cross-agent config");
  const unknownKeys = Object.keys(parsedConfig ?? {}).filter((key) => !CONFIG_KEYS.has(key));

  if (unknownKeys.length > 0) {
    throw new Error(
      `Cross-agent config at ${resolvedConfigPath} contains unknown keys: ${unknownKeys.join(", ")}`
    );
  }

  const transcriptDropFolder = parsedConfig?.transcriptDropFolder;

  if (typeof transcriptDropFolder !== "string" || transcriptDropFolder.trim() === "") {
    throw new Error(
      `Cross-agent config at ${resolvedConfigPath} must define a non-empty "transcriptDropFolder" string.`
    );
  }

  const resolvedDropFolder = path.isAbsolute(transcriptDropFolder)
    ? transcriptDropFolder
    : path.resolve(resolvedRootDir, transcriptDropFolder);

  if (!fs.existsSync(resolvedDropFolder)) {
    throw new Error(
      `Configured transcriptDropFolder does not exist: ${resolvedDropFolder}. Update ${resolvedConfigPath}.`
    );
  }

  if (!fs.statSync(resolvedDropFolder).isDirectory()) {
    throw new Error(
      `Configured transcriptDropFolder is not a directory: ${resolvedDropFolder}. Update ${resolvedConfigPath}.`
    );
  }

  let transcriptExtensions = DEFAULT_TRANSCRIPT_EXTENSIONS;

  if (Object.hasOwn(parsedConfig ?? {}, "transcriptExtensions")) {
    if (
      !Array.isArray(parsedConfig.transcriptExtensions) ||
      parsedConfig.transcriptExtensions.length === 0 ||
      parsedConfig.transcriptExtensions.some((value) => typeof value !== "string" || value.trim() === "")
    ) {
      throw new Error(
        `Cross-agent config at ${resolvedConfigPath} must define "transcriptExtensions" as a non-empty array of strings when provided.`
      );
    }

    transcriptExtensions = parsedConfig.transcriptExtensions.map(normalizeExtension);
  }

  return {
    rootDir: resolvedRootDir,
    configPath: resolvedConfigPath,
    transcriptDropFolder: resolvedDropFolder,
    transcriptExtensions,
  };
}

export function findLatestTranscriptFile({ transcriptDropFolder, transcriptExtensions }) {
  const allowedExtensions = new Set(
    (transcriptExtensions?.length ? transcriptExtensions : DEFAULT_TRANSCRIPT_EXTENSIONS).map(normalizeExtension)
  );

  const candidates = fs
    .readdirSync(transcriptDropFolder, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => {
      const absolutePath = path.join(transcriptDropFolder, entry.name);
      return {
        absolutePath,
        name: entry.name,
        extension: path.extname(entry.name).toLowerCase(),
        stats: fs.statSync(absolutePath),
      };
    })
    .filter((entry) => allowedExtensions.has(entry.extension))
    .sort((left, right) => {
      if (right.stats.mtimeMs !== left.stats.mtimeMs) {
        return right.stats.mtimeMs - left.stats.mtimeMs;
      }

      return right.name.localeCompare(left.name);
    });

  if (candidates.length === 0) {
    throw new Error(
      `No transcript files found in ${transcriptDropFolder}. Allowed extensions: ${[...allowedExtensions].join(", ")}`
    );
  }

  return candidates[0];
}

function currentPackHasFiles(currentDir) {
  if (!fs.existsSync(currentDir)) {
    return false;
  }

  return fs.readdirSync(currentDir).length > 0;
}

function getArchiveDestination(baseArchiveDir) {
  if (!fs.existsSync(baseArchiveDir)) {
    return baseArchiveDir;
  }

  let attempt = 2;
  while (true) {
    const candidate = `${baseArchiveDir}-${attempt}`;
    if (!fs.existsSync(candidate)) {
      return candidate;
    }
    attempt += 1;
  }
}

export function archiveCurrentPack({ currentDir, archiveRootDir, timestamp, slug }) {
  if (!currentPackHasFiles(currentDir)) {
    return null;
  }

  ensureDirectory(archiveRootDir);
  const baseArchiveDir = path.join(archiveRootDir, `${timestamp}-${slugify(slug)}`);
  const archiveDir = getArchiveDestination(baseArchiveDir);
  fs.cpSync(currentDir, archiveDir, { recursive: true });
  return archiveDir;
}

function createEmptyAutomationState() {
  return {
    version: 2,
    tools: {
      codex: {
        initialized: false,
        firstRunAt: null,
        lastRunAt: null,
        lastScanMode: null,
      },
      antigravity: {
        initialized: false,
        firstRunAt: null,
        lastRunAt: null,
        lastScanMode: null,
      },
    },
    lastDocsAuditAt: null,
    lastRefreshAt: null,
  };
}

function readAutomationState(currentDir, warnings) {
  const automationStatePath = path.join(currentDir, "automation-state.json");

  if (!fs.existsSync(automationStatePath)) {
    return createEmptyAutomationState();
  }

  try {
    return mergeAutomationState(JSON.parse(fs.readFileSync(automationStatePath, "utf8")));
  } catch (error) {
    pushWarning(
      warnings,
      "automation-state-invalid",
      `The existing automation-state.json is malformed. Using default automation state for this run.`,
      {
        path: automationStatePath,
        error: error instanceof Error ? error.message : String(error),
      }
    );
    return createEmptyAutomationState();
  }
}

function computeScanMode({ currentTool, fullScan, automationState }) {
  if (fullScan) {
    return "full_scan";
  }

  if (!currentTool) {
    return "legacy_import";
  }

  return automationState.tools[currentTool]?.initialized ? "incremental" : "full_scan";
}

function readJsonLinesDetailed(filePath, warnings, label) {
  const parsedEntries = [];
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];

    if (!line.trim()) {
      continue;
    }

    try {
      parsedEntries.push(JSON.parse(line));
    } catch (error) {
      pushWarning(
        warnings,
        "jsonl-line-invalid",
        `${label} contains an invalid JSON line.`,
        {
          path: filePath,
          line: index + 1,
          error: error instanceof Error ? error.message : String(error),
        }
      );
    }
  }

  return parsedEntries;
}

function tryOpenDatabase(databasePath, warnings, label) {
  if (!databasePath || !fs.existsSync(databasePath)) {
    pushWarning(warnings, "sqlite-missing", `${label} is missing; continuing without SQLite enrichment.`, {
      path: databasePath,
    });
    return null;
  }

  try {
    return new DatabaseSync(databasePath, { readonly: true });
  } catch (error) {
    pushWarning(warnings, "sqlite-open-failed", `${label} could not be opened; continuing without SQLite enrichment.`, {
      path: databasePath,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

function createSource({
  role,
  tool,
  requestedReference = null,
  referenceType,
  conversationId = null,
  title = null,
}) {
  return {
    role,
    tool,
    requestedReference,
    referenceType,
    conversationId,
    title,
    canonicalKey: null,
    status: "ok",
    persistedSources: [],
    artifacts: [],
    warnings: [],
    transcriptSegments: [],
  };
}

function addPersistedSource(source, persistedSource) {
  source.persistedSources.push(persistedSource);
}

function addArtifact(source, artifact) {
  source.artifacts.push(artifact);
}

function addTranscriptSegment(source, label, content) {
  if (typeof content !== "string" || content.trim() === "") {
    return;
  }

  source.transcriptSegments.push({
    label,
    content: content.trimEnd(),
  });
}

function finalizeSource(source) {
  if (source.status !== "error" && source.warnings.length > 0) {
    source.status = "partial";
  }

  return source;
}

function buildCurrentOnlyCanonicalKey(tool, transcriptContent) {
  return typeof transcriptContent === "string" && transcriptContent.trim() !== ""
    ? `${tool}:live:${hashText(transcriptContent.trim())}`
    : `${tool}:live:current`;
}

function buildCodexCanonicalKey({ conversationId, rolloutPath, title, requestedReference }) {
  if (conversationId) {
    return `codex:conversation:${conversationId}`;
  }

  if (rolloutPath && fs.existsSync(rolloutPath)) {
    return `codex:rollout:${fs.realpathSync.native(rolloutPath)}`;
  }

  if (title) {
    return `codex:title:${title}`;
  }

  if (requestedReference) {
    return `codex:reference:${requestedReference}`;
  }

  return null;
}

function buildAntigravityCanonicalKey({ conversationId, brainDir, pbPath, requestedReference }) {
  if (conversationId) {
    return `antigravity:conversation:${conversationId}`;
  }

  if (brainDir && fs.existsSync(brainDir)) {
    return `antigravity:brain:${fs.realpathSync.native(brainDir)}`;
  }

  if (pbPath && fs.existsSync(pbPath)) {
    return `antigravity:pb:${fs.realpathSync.native(pbPath)}`;
  }

  if (requestedReference) {
    return `antigravity:reference:${requestedReference}`;
  }

  return null;
}

function buildExternalCanonicalKey(absolutePath) {
  return `external:path:${path.resolve(absolutePath)}`;
}

function readSessionIndexEntries(codexHome, warnings) {
  const sessionIndexPath = path.join(codexHome, "session_index.jsonl");

  if (!fs.existsSync(sessionIndexPath)) {
    pushWarning(
      warnings,
      "session-index-missing",
      "Codex session_index.jsonl is missing; continuing without session-index enrichment.",
      { path: sessionIndexPath }
    );
    return [];
  }

  return readJsonLinesDetailed(sessionIndexPath, warnings, "Codex session index")
    .map((entry) => ({
      id: entry.id ?? null,
      threadName: entry.thread_name ?? null,
      updatedAt: entry.updated_at ?? null,
      path: sessionIndexPath,
    }))
    .sort((left, right) => {
      const leftTime = left.updatedAt ? Date.parse(left.updatedAt) : 0;
      const rightTime = right.updatedAt ? Date.parse(right.updatedAt) : 0;
      return rightTime - leftTime;
    });
}

function queryCodexThreadRows(codexHome, warnings) {
  const stateDbPath = path.join(codexHome, "state_5.sqlite");
  const database = tryOpenDatabase(stateDbPath, warnings, "Codex state_5.sqlite");

  if (!database) {
    return [];
  }

  try {
    return database
      .prepare(
        `
          select id, rollout_path, title, updated_at_ms, updated_at, first_user_message, cwd, source, model_provider
          from threads
          where archived = 0
          order by updated_at_ms desc, updated_at desc
        `
      )
      .all();
  } catch (error) {
    pushWarning(
      warnings,
      "sqlite-query-failed",
      "Codex thread database could not be queried; continuing without SQLite enrichment.",
      {
        path: stateDbPath,
        error: error instanceof Error ? error.message : String(error),
      }
    );
    return [];
  } finally {
    database.close();
  }
}

function findCodexThreadById(threadRows, threadId) {
  return threadRows.find((row) => row.id === threadId) ?? null;
}

function findCodexThreadByTitle(threadRows, title) {
  return threadRows.find((row) => row.title === title) ?? null;
}

function findCodexSessionIndexEntry(sessionIndexEntries, value) {
  return sessionIndexEntries.find((entry) => entry.id === value || entry.threadName === value) ?? null;
}

function normalizeCodexRolloutPath(codexHome, rolloutPath) {
  if (!rolloutPath) {
    return null;
  }

  return path.isAbsolute(rolloutPath) ? rolloutPath : path.join(codexHome, rolloutPath);
}

function inferCodexThreadIdFromRollout(rolloutPath) {
  const fileName = path.basename(rolloutPath);
  const parts = fileName.split("-");
  return parts[parts.length - 1]?.replace(/\.jsonl$/i, "") ?? null;
}

function findCodexRolloutByConversationId(codexHome, conversationId) {
  if (!conversationId) {
    return null;
  }

  const sessionsRoot = path.join(codexHome, "sessions");

  if (!fs.existsSync(sessionsRoot)) {
    return null;
  }

  const queue = [sessionsRoot];

  while (queue.length > 0) {
    const directory = queue.shift();

    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const entryPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        queue.push(entryPath);
        continue;
      }

      if (entry.isFile() && entry.name.endsWith(`${conversationId}.jsonl`)) {
        return entryPath;
      }
    }
  }

  return null;
}

function inspectCodexRolloutJsonl(rolloutPath, warnings) {
  if (!rolloutPath || !fs.existsSync(rolloutPath)) {
    return;
  }

  readJsonLinesDetailed(rolloutPath, warnings, "Codex rollout log");
}

function resolveCurrentCodexSource({ codexHome, currentConversation }) {
  const source = createSource({
    role: "current",
    tool: "codex",
    referenceType: "current-live-conversation",
  });
  const threadRows = queryCodexThreadRows(codexHome, source.warnings);
  const sessionIndexEntries = readSessionIndexEntries(codexHome, source.warnings);
  const desiredConversationId = currentConversation?.conversationId ?? threadRows[0]?.id ?? sessionIndexEntries[0]?.id ?? null;
  const desiredThreadTitle = currentConversation?.threadTitle ?? null;

  const threadRow =
    findCodexThreadById(threadRows, desiredConversationId) ??
    (desiredThreadTitle ? findCodexThreadByTitle(threadRows, desiredThreadTitle) : null) ??
    threadRows[0] ??
    null;

  const sessionIndexEntry =
    findCodexSessionIndexEntry(sessionIndexEntries, threadRow?.id ?? desiredConversationId) ??
    (desiredThreadTitle ? findCodexSessionIndexEntry(sessionIndexEntries, desiredThreadTitle) : null);

  const rolloutPath = normalizeCodexRolloutPath(
    codexHome,
    threadRow?.rollout_path ??
      findCodexRolloutByConversationId(codexHome, threadRow?.id ?? sessionIndexEntry?.id ?? desiredConversationId) ??
      null
  );

  source.conversationId = threadRow?.id ?? sessionIndexEntry?.id ?? desiredConversationId ?? null;
  source.title =
    threadRow?.title ?? sessionIndexEntry?.threadName ?? desiredThreadTitle ?? source.conversationId ?? "Codex conversation";

  if (threadRow) {
    addPersistedSource(source, {
      kind: "codex-thread-row",
      id: threadRow.id,
      title: threadRow.title ?? null,
      rolloutPath: normalizeCodexRolloutPath(codexHome, threadRow.rollout_path),
    });
    addArtifact(source, {
      kind: "codex-thread-row",
      updatedAtMs: threadRow.updated_at_ms ?? null,
      cwd: threadRow.cwd ?? null,
      source: threadRow.source ?? null,
      modelProvider: threadRow.model_provider ?? null,
    });
  }

  if (sessionIndexEntry) {
    addPersistedSource(source, {
      kind: "codex-session-index",
      path: sessionIndexEntry.path,
      id: sessionIndexEntry.id,
      title: sessionIndexEntry.threadName ?? null,
      updatedAt: sessionIndexEntry.updatedAt ?? null,
    });
  }

  if (rolloutPath && fs.existsSync(rolloutPath)) {
    inspectCodexRolloutJsonl(rolloutPath, source.warnings);
    addPersistedSource(source, {
      kind: "codex-rollout-jsonl",
      path: rolloutPath,
      size: fs.statSync(rolloutPath).size,
    });
    addArtifact(source, {
      kind: "codex-rollout-jsonl",
      sha256: hashFile(rolloutPath),
    });
    addTranscriptSegment(source, `${source.title} rollout log`, fs.readFileSync(rolloutPath, "utf8"));
  } else if (source.conversationId) {
    pushWarning(
      source.warnings,
      "codex-rollout-missing",
      "No Codex rollout JSONL was found for the resolved conversation.",
      { conversationId: source.conversationId }
    );
  }

  addTranscriptSegment(
    source,
    `${source.title} live conversation`,
    currentConversation?.transcriptContent ?? null
  );

  source.canonicalKey = buildCodexCanonicalKey({
    conversationId: source.conversationId,
    rolloutPath,
    title: source.title,
  });

  if (!source.conversationId && source.transcriptSegments.length === 0) {
    source.status = "error";
    pushWarning(
      source.warnings,
      "codex-current-unresolved",
      "The current Codex conversation could not be resolved from live context or persisted session surfaces."
    );
    source.canonicalKey = buildCurrentOnlyCanonicalKey("codex", currentConversation?.transcriptContent ?? "");
  }

  return finalizeSource(source);
}

function resolveCodexReference({ codexHome, reference }) {
  const source = createSource({
    role: "reference",
    tool: "codex",
    requestedReference: reference,
    referenceType: "unknown",
  });
  const threadRows = queryCodexThreadRows(codexHome, source.warnings);
  const sessionIndexEntries = readSessionIndexEntries(codexHome, source.warnings);

  if (typeof reference === "string" && fs.existsSync(reference)) {
    const resolvedPath = path.resolve(reference);
    const stats = fs.statSync(resolvedPath);

    if (!stats.isFile()) {
      source.status = "error";
      source.referenceType = "unsupported-path";
      pushWarning(
        source.warnings,
        "codex-reference-path-unsupported",
        "Codex references support rollout JSONL files and exported transcript files only.",
        { path: resolvedPath }
      );
      source.canonicalKey = `codex:reference:${resolvedPath}`;
      return finalizeSource(source);
    }

    if (resolvedPath.endsWith(".jsonl")) {
      const inferredThreadId = inferCodexThreadIdFromRollout(resolvedPath);
      const threadRow = findCodexThreadById(threadRows, inferredThreadId);
      const sessionIndexEntry = findCodexSessionIndexEntry(sessionIndexEntries, inferredThreadId);

      source.referenceType = "rollout-jsonl-path";
      source.conversationId = threadRow?.id ?? sessionIndexEntry?.id ?? inferredThreadId ?? null;
      source.title = threadRow?.title ?? sessionIndexEntry?.threadName ?? path.basename(resolvedPath);

      inspectCodexRolloutJsonl(resolvedPath, source.warnings);
      addPersistedSource(source, {
        kind: "codex-rollout-jsonl",
        path: resolvedPath,
        size: stats.size,
      });
      addArtifact(source, {
        kind: "codex-rollout-jsonl",
        sha256: hashFile(resolvedPath),
      });
      addTranscriptSegment(source, `${source.title} rollout log`, fs.readFileSync(resolvedPath, "utf8"));

      if (threadRow) {
        addPersistedSource(source, {
          kind: "codex-thread-row",
          id: threadRow.id,
          title: threadRow.title ?? null,
          rolloutPath: normalizeCodexRolloutPath(codexHome, threadRow.rollout_path),
        });
      }

      if (sessionIndexEntry) {
        addPersistedSource(source, {
          kind: "codex-session-index",
          path: sessionIndexEntry.path,
          id: sessionIndexEntry.id,
          title: sessionIndexEntry.threadName ?? null,
          updatedAt: sessionIndexEntry.updatedAt ?? null,
        });
      }

      source.canonicalKey = buildCodexCanonicalKey({
        conversationId: source.conversationId,
        rolloutPath: resolvedPath,
        title: source.title,
        requestedReference: reference,
      });

      return finalizeSource(source);
    }

    source.referenceType = "exported-transcript-path";
    source.title = path.basename(resolvedPath);
    source.canonicalKey = buildExternalCanonicalKey(resolvedPath);
    addPersistedSource(source, {
      kind: "exported-transcript",
      path: resolvedPath,
      size: stats.size,
    });
    addArtifact(source, {
      kind: "exported-transcript",
      sha256: hashFile(resolvedPath),
    });
    addTranscriptSegment(source, path.basename(resolvedPath), fs.readFileSync(resolvedPath, "utf8"));
    return finalizeSource(source);
  }

  const threadRow = findCodexThreadById(threadRows, reference) ?? findCodexThreadByTitle(threadRows, reference);
  const sessionIndexEntry = findCodexSessionIndexEntry(sessionIndexEntries, reference);
  const rolloutPath = normalizeCodexRolloutPath(
    codexHome,
    threadRow?.rollout_path ??
      findCodexRolloutByConversationId(codexHome, threadRow?.id ?? sessionIndexEntry?.id ?? reference) ??
      null
  );

  source.referenceType = threadRow?.id === reference || sessionIndexEntry?.id === reference ? "thread-id" : "thread-title";
  source.conversationId = threadRow?.id ?? sessionIndexEntry?.id ?? null;
  source.title = threadRow?.title ?? sessionIndexEntry?.threadName ?? String(reference);

  if (threadRow) {
    addPersistedSource(source, {
      kind: "codex-thread-row",
      id: threadRow.id,
      title: threadRow.title ?? null,
      rolloutPath: normalizeCodexRolloutPath(codexHome, threadRow.rollout_path),
    });
  }

  if (sessionIndexEntry) {
    addPersistedSource(source, {
      kind: "codex-session-index",
      path: sessionIndexEntry.path,
      id: sessionIndexEntry.id,
      title: sessionIndexEntry.threadName ?? null,
      updatedAt: sessionIndexEntry.updatedAt ?? null,
    });
  }

  if (rolloutPath && fs.existsSync(rolloutPath)) {
    inspectCodexRolloutJsonl(rolloutPath, source.warnings);
    addPersistedSource(source, {
      kind: "codex-rollout-jsonl",
      path: rolloutPath,
      size: fs.statSync(rolloutPath).size,
    });
    addArtifact(source, {
      kind: "codex-rollout-jsonl",
      sha256: hashFile(rolloutPath),
    });
    addTranscriptSegment(source, `${source.title} rollout log`, fs.readFileSync(rolloutPath, "utf8"));
  }

  source.canonicalKey = buildCodexCanonicalKey({
    conversationId: source.conversationId,
    rolloutPath,
    title: source.title,
    requestedReference: reference,
  });

  if (!source.conversationId && source.transcriptSegments.length === 0) {
    source.status = "error";
    pushWarning(
      source.warnings,
      "codex-reference-unresolved",
      "The requested Codex reference could not be resolved to a thread, rollout JSONL, or exported transcript.",
      { requestedReference: reference }
    );
    source.canonicalKey = `codex:reference:${reference}`;
  }

  return finalizeSource(source);
}

function parseAntigravityAnnotation(annotationPath, warnings) {
  if (!annotationPath || !fs.existsSync(annotationPath)) {
    return null;
  }

  try {
    const text = fs.readFileSync(annotationPath, "utf8");
    const match = text.match(/seconds:(\d+)\s+nanos:(\d+)/);

    if (!match) {
      return {
        kind: "antigravity-annotation",
        path: annotationPath,
        raw: text.trim(),
      };
    }

    return {
      kind: "antigravity-annotation",
      path: annotationPath,
      lastUserViewTime: {
        seconds: Number(match[1]),
        nanos: Number(match[2]),
      },
    };
  } catch (error) {
    pushWarning(
      warnings,
      "antigravity-annotation-invalid",
      "An Antigravity annotation file could not be read.",
      { path: annotationPath, error: error instanceof Error ? error.message : String(error) }
    );
    return null;
  }
}

function readAntigravityBrainMetadata(brainDir, warnings) {
  if (!brainDir || !fs.existsSync(brainDir)) {
    return [];
  }

  return fs
    .readdirSync(brainDir)
    .filter((fileName) => fileName.endsWith(".metadata.json"))
    .sort((left, right) => left.localeCompare(right))
    .map((fileName) => {
      const filePath = path.join(brainDir, fileName);

      try {
        const parsed = readJsonFileStrict(filePath, "Antigravity metadata");
        return {
          kind: "brain-metadata",
          fileName,
          path: filePath,
          parseStatus: "ok",
          artifactType: parsed.artifactType ?? null,
          summary: parsed.summary ?? null,
          updatedAt: parsed.updatedAt ?? null,
          version: parsed.version ?? null,
        };
      } catch (error) {
        pushWarning(
          warnings,
          "antigravity-metadata-invalid",
          "An Antigravity metadata JSON file is malformed.",
          { path: filePath, error: error instanceof Error ? error.message : String(error) }
        );
        return {
          kind: "brain-metadata",
          fileName,
          path: filePath,
          parseStatus: "error",
        };
      }
    });
}

function readAntigravityStructuredFiles(brainDir) {
  if (!brainDir || !fs.existsSync(brainDir)) {
    return [];
  }

  return fs
    .readdirSync(brainDir)
    .filter((fileName) => fileName.endsWith(".md") && !fileName.includes(".resolved"))
    .sort((left, right) => left.localeCompare(right))
    .map((fileName) => {
      const filePath = path.join(brainDir, fileName);
      return {
        fileName,
        path: filePath,
        content: fs.readFileSync(filePath, "utf8"),
      };
    });
}

function buildOpaquePbMetadata(pbPath) {
  if (!pbPath || !fs.existsSync(pbPath)) {
    return null;
  }

  const stats = fs.statSync(pbPath);

  return {
    kind: "antigravity-pb",
    path: pbPath,
    basenameUuid: path.basename(pbPath, path.extname(pbPath)),
    size: stats.size,
    mtime: toIsoString(stats.mtime),
    sha256: hashFile(pbPath),
    parseAttempt: {
      status: "opaque",
      message: "No protobuf schema is available; the Antigravity .pb conversation file is stored as an opaque binary artifact.",
    },
  };
}

function inferAntigravityConversationIdFromReference(referencePath) {
  const normalizedPath = path.resolve(referencePath);
  const stats = fs.statSync(normalizedPath);
  return stats.isDirectory()
    ? path.basename(normalizedPath)
    : path.basename(normalizedPath, path.extname(normalizedPath));
}

function listAntigravityConversationCandidates(antigravityHome) {
  const candidates = new Map();
  const addCandidate = (conversationId, sortTime, kind) => {
    if (!conversationId) {
      return;
    }

    const prior = candidates.get(conversationId);
    if (!prior || sortTime > prior.sortTime) {
      candidates.set(conversationId, { conversationId, sortTime, kind });
    }
  };

  const brainRoot = path.join(antigravityHome, "brain");
  if (fs.existsSync(brainRoot)) {
    for (const entry of fs.readdirSync(brainRoot, { withFileTypes: true })) {
      if (!entry.isDirectory()) {
        continue;
      }

      const brainDir = path.join(brainRoot, entry.name);
      const metadataTimes = fs
        .readdirSync(brainDir)
        .filter((fileName) => fileName.endsWith(".metadata.json"))
        .map((fileName) => fs.statSync(path.join(brainDir, fileName)).mtimeMs);
      const latestTime = metadataTimes.length > 0 ? Math.max(...metadataTimes) : fs.statSync(brainDir).mtimeMs;
      addCandidate(entry.name, latestTime, "brain");
    }
  }

  const conversationsRoot = path.join(antigravityHome, "conversations");
  if (fs.existsSync(conversationsRoot)) {
    for (const entry of fs.readdirSync(conversationsRoot, { withFileTypes: true })) {
      if (!entry.isFile() || !entry.name.endsWith(".pb")) {
        continue;
      }

      const filePath = path.join(conversationsRoot, entry.name);
      addCandidate(path.basename(entry.name, ".pb"), fs.statSync(filePath).mtimeMs, "pb");
    }
  }

  const annotationsRoot = path.join(antigravityHome, "annotations");
  if (fs.existsSync(annotationsRoot)) {
    for (const entry of fs.readdirSync(annotationsRoot, { withFileTypes: true })) {
      if (!entry.isFile() || !entry.name.endsWith(".pbtxt")) {
        continue;
      }

      const filePath = path.join(annotationsRoot, entry.name);
      addCandidate(path.basename(entry.name, ".pbtxt"), fs.statSync(filePath).mtimeMs, "annotation");
    }
  }

  return [...candidates.values()].sort((left, right) => right.sortTime - left.sortTime);
}

function buildAntigravitySource({
  role,
  antigravityHome,
  conversationId,
  requestedReference = null,
  referenceType,
  liveTranscript = null,
}) {
  const source = createSource({
    role,
    tool: "antigravity",
    requestedReference,
    referenceType,
    conversationId: conversationId ?? null,
  });

  if (!conversationId) {
    addTranscriptSegment(source, "live antigravity conversation", liveTranscript);
    source.canonicalKey = buildCurrentOnlyCanonicalKey("antigravity", liveTranscript ?? "");
    source.status = source.transcriptSegments.length > 0 ? "partial" : "error";
    pushWarning(
      source.warnings,
      "antigravity-conversation-missing",
      "No Antigravity conversation UUID was available; only live transcript content could be used."
    );
    return finalizeSource(source);
  }

  const brainDir = path.join(antigravityHome, "brain", conversationId);
  const pbPath = path.join(antigravityHome, "conversations", `${conversationId}.pb`);
  const annotationPath = path.join(antigravityHome, "annotations", `${conversationId}.pbtxt`);

  source.title = conversationId;

  if (fs.existsSync(brainDir)) {
    addPersistedSource(source, {
      kind: "antigravity-brain",
      path: brainDir,
    });
  } else {
    pushWarning(
      source.warnings,
      "antigravity-brain-missing",
      "No Antigravity brain directory was found for the resolved conversation.",
      { path: brainDir }
    );
  }

  const metadataArtifacts = readAntigravityBrainMetadata(brainDir, source.warnings);
  if (metadataArtifacts.length > 0) {
    for (const metadataArtifact of metadataArtifacts) {
      addArtifact(source, metadataArtifact);
    }

    const firstSummary = metadataArtifacts.find((artifact) => artifact.parseStatus === "ok" && artifact.summary)?.summary;
    if (firstSummary) {
      source.title = firstSummary;
    }
  }

  const structuredFiles = readAntigravityStructuredFiles(brainDir);
  for (const structuredFile of structuredFiles) {
    addArtifact(source, {
      kind: "brain-markdown",
      path: structuredFile.path,
      fileName: structuredFile.fileName,
    });
    addTranscriptSegment(source, structuredFile.fileName, structuredFile.content);
  }

  const annotationArtifact = parseAntigravityAnnotation(annotationPath, source.warnings);
  if (annotationArtifact) {
    addPersistedSource(source, {
      kind: "antigravity-annotation",
      path: annotationPath,
    });
    addArtifact(source, annotationArtifact);
  }

  const pbArtifact = buildOpaquePbMetadata(pbPath);
  if (pbArtifact) {
    addPersistedSource(source, {
      kind: "antigravity-pb",
      path: pbPath,
      size: pbArtifact.size,
    });
    addArtifact(source, pbArtifact);
  } else {
    pushWarning(
      source.warnings,
      "antigravity-pb-missing",
      "No Antigravity raw .pb file was found for the resolved conversation.",
      { path: pbPath }
    );
  }

  addTranscriptSegment(source, `${conversationId} live conversation`, liveTranscript);

  source.canonicalKey = buildAntigravityCanonicalKey({
    conversationId,
    brainDir,
    pbPath,
    requestedReference,
  });

  if (source.transcriptSegments.length === 0) {
    pushWarning(
      source.warnings,
      "antigravity-transcript-empty",
      "No transcriptable Antigravity content was available for the resolved conversation."
    );
  }

  return finalizeSource(source);
}

function resolveCurrentAntigravitySource({ antigravityHome, currentConversation }) {
  const currentConversationId =
    currentConversation?.conversationId ?? listAntigravityConversationCandidates(antigravityHome)[0]?.conversationId ?? null;

  return buildAntigravitySource({
    role: "current",
    antigravityHome,
    conversationId: currentConversationId,
    referenceType: "current-live-conversation",
    liveTranscript: currentConversation?.transcriptContent ?? null,
  });
}

function resolveAntigravityReference({ antigravityHome, reference }) {
  if (typeof reference === "string" && fs.existsSync(reference)) {
    const resolvedPath = path.resolve(reference);
    const stats = fs.statSync(resolvedPath);

    if (stats.isDirectory()) {
      return buildAntigravitySource({
        role: "reference",
        antigravityHome,
        conversationId: inferAntigravityConversationIdFromReference(resolvedPath),
        requestedReference: reference,
        referenceType: "brain-directory-path",
      });
    }

    if (resolvedPath.endsWith(".pb")) {
      return buildAntigravitySource({
        role: "reference",
        antigravityHome,
        conversationId: inferAntigravityConversationIdFromReference(resolvedPath),
        requestedReference: reference,
        referenceType: "pb-path",
      });
    }

    const source = createSource({
      role: "reference",
      tool: "antigravity",
      requestedReference: reference,
      referenceType: "exported-transcript-path",
      title: path.basename(resolvedPath),
    });
    source.canonicalKey = buildExternalCanonicalKey(resolvedPath);
    addPersistedSource(source, {
      kind: "exported-transcript",
      path: resolvedPath,
      size: stats.size,
    });
    addArtifact(source, {
      kind: "exported-transcript",
      sha256: hashFile(resolvedPath),
    });
    addTranscriptSegment(source, path.basename(resolvedPath), fs.readFileSync(resolvedPath, "utf8"));
    return finalizeSource(source);
  }

  return buildAntigravitySource({
    role: "reference",
    antigravityHome,
    conversationId: reference,
    requestedReference: reference,
    referenceType: "uuid",
  });
}

function buildLegacyTranscriptSource({ loadedConfig }) {
  const transcriptFile = findLatestTranscriptFile(loadedConfig);
  const source = createSource({
    role: "current",
    tool: "external",
    requestedReference: transcriptFile.absolutePath,
    referenceType: "latest-drop-folder-transcript",
    title: transcriptFile.name,
  });

  source.canonicalKey = buildExternalCanonicalKey(transcriptFile.absolutePath);
  addPersistedSource(source, {
    kind: "latest-drop-folder-transcript",
    path: transcriptFile.absolutePath,
    size: transcriptFile.stats.size,
  });
  addArtifact(source, {
    kind: "latest-drop-folder-transcript",
    sha256: hashFile(transcriptFile.absolutePath),
  });
  addTranscriptSegment(source, transcriptFile.name, fs.readFileSync(transcriptFile.absolutePath, "utf8"));
  return source;
}

function dedupeReferences(currentSource, referenceSources) {
  const keptReferences = [];
  const duplicatesRemoved = [];
  const seenKeys = new Map();

  if (currentSource.canonicalKey) {
    seenKeys.set(currentSource.canonicalKey, {
      role: currentSource.role,
      requestedReference: currentSource.requestedReference,
    });
  }

  for (const referenceSource of referenceSources) {
    const canonicalKey = referenceSource.canonicalKey;
    if (canonicalKey && seenKeys.has(canonicalKey)) {
      const kept = seenKeys.get(canonicalKey);
      duplicatesRemoved.push({
        requestedReference: referenceSource.requestedReference ?? null,
        referenceType: referenceSource.referenceType,
        canonicalKey,
        keptRole: kept.role,
        keptRequestedReference: kept.requestedReference ?? null,
        reason:
          kept.role === "current"
            ? "duplicate_of_current_source"
            : "duplicate_of_previous_explicit_reference",
      });
      continue;
    }

    if (canonicalKey) {
      seenKeys.set(canonicalKey, {
        role: referenceSource.role,
        requestedReference: referenceSource.requestedReference,
      });
    }

    keptReferences.push(referenceSource);
  }

  return { keptReferences, duplicatesRemoved };
}

function resolveConversationSources({
  currentTool,
  currentConversation,
  includeReferences,
  codexHome,
  antigravityHome,
  loadedConfig,
}) {
  if (!currentTool) {
    const currentSource = buildLegacyTranscriptSource({ loadedConfig });
    return {
      currentSource,
      referenceSources: [],
      globalWarnings: [],
    };
  }

  const currentSource =
    currentTool === "codex"
      ? resolveCurrentCodexSource({ codexHome, currentConversation })
      : resolveCurrentAntigravitySource({ antigravityHome, currentConversation });

  const referenceSources = (includeReferences ?? []).map((reference) =>
    currentTool === "codex"
      ? resolveCodexReference({ codexHome, reference })
      : resolveAntigravityReference({ antigravityHome, reference })
  );

  return {
    currentSource,
    referenceSources,
    globalWarnings: [],
  };
}

function buildConversationSourcesState({ currentTool, scanMode, warnings, duplicatesRemoved, sources }) {
  return {
    version: 2,
    tool: currentTool ?? "external",
    scanMode,
    warnings,
    duplicatesRemoved,
    sources: sources.map((source) => ({
      role: source.role,
      tool: source.tool,
      canonicalKey: source.canonicalKey ?? null,
      requestedReference: source.requestedReference ?? null,
      referenceType: source.referenceType,
      conversationId: source.conversationId ?? null,
      title: source.title ?? null,
      status: source.status,
      persistedSources: source.persistedSources,
      artifacts: source.artifacts,
      warnings: source.warnings,
    })),
  };
}

function formatWarningLines(warnings) {
  if (!warnings.length) {
    return ["- none"];
  }

  return warnings.map((warning) => {
    const details = [];
    if (warning.path) {
      details.push(`path: ${warning.path}`);
    }
    if (warning.line) {
      details.push(`line: ${warning.line}`);
    }
    if (warning.error) {
      details.push(`error: ${warning.error}`);
    }
    if (warning.requestedReference) {
      details.push(`requestedReference: ${warning.requestedReference}`);
    }
    return details.length > 0
      ? `- ${warning.code}: ${warning.message} (${details.join("; ")})`
      : `- ${warning.code}: ${warning.message}`;
  });
}

function formatSourceTranscriptSection(source, index) {
  const header = source.role === "current" ? "Current Conversation" : `Referenced Conversation ${index}`;
  const lines = [`## ${header}`, ""];

  lines.push(`- Tool: \`${source.tool}\``);
  lines.push(`- Status: \`${source.status}\``);
  lines.push(`- Reference type: \`${source.referenceType}\``);
  lines.push(`- Canonical key: \`${source.canonicalKey ?? "none"}\``);

  if (source.requestedReference) {
    lines.push(`- Requested reference: \`${source.requestedReference}\``);
  }
  if (source.conversationId) {
    lines.push(`- Conversation ID: \`${source.conversationId}\``);
  }
  if (source.title) {
    lines.push(`- Title: ${source.title}`);
  }

  lines.push("");
  lines.push("### Warnings");
  lines.push("");
  lines.push(...formatWarningLines(source.warnings));
  lines.push("");

  if (!source.transcriptSegments.length) {
    lines.push("_No transcriptable content was available for this source._");
    lines.push("");
    return lines.join("\n");
  }

  for (const transcriptSegment of source.transcriptSegments) {
    lines.push(`### ${transcriptSegment.label}`);
    lines.push("");
    lines.push(transcriptSegment.content);
    lines.push("");
  }

  return lines.join("\n");
}

function buildCurrentPackFiles({
  rootDir,
  importedAt,
  archiveDir,
  config,
  currentTool,
  scanMode,
  warnings,
  duplicatesRemoved,
  sources,
  automationState,
  conversationSourcesState,
}) {
  const importedAtIso = toIsoString(importedAt);
  const archiveRelativePath = archiveDir ? toRepoRelativePath(rootDir, archiveDir) : "none";
  const configRelativePath = config?.configPath ? toRepoRelativePath(rootDir, config.configPath) : "none";
  const currentPackRelativePath = toRepoRelativePath(rootDir, resolveRepoPath(rootDir, CROSS_AGENT_CURRENT_DIR));
  const referencesDocRelativePath = toRepoRelativePath(
    rootDir,
    resolveRepoPath(rootDir, path.join(CROSS_AGENT_DOCS_DIR, "REFERENCES.md"))
  );
  const currentSource = sources.find((source) => source.role === "current") ?? null;
  const totalSourceWarnings = sources.reduce((total, source) => total + source.warnings.length, 0);

  const summaryLines = [
    "# Summary",
    "",
    `- Last refresh: \`${importedAtIso}\``,
    `- Invoking tool: \`${currentTool ?? "external"}\``,
    `- Scan mode: \`${scanMode}\``,
    `- Current pack path: \`${currentPackRelativePath}\``,
    `- Current source: \`${currentSource?.conversationId ?? currentSource?.title ?? "none"}\``,
    `- Kept explicit references: \`${sources.filter((source) => source.role === "reference").length}\``,
    `- Duplicates removed: \`${duplicatesRemoved.length}\``,
    `- Warning count: \`${warnings.length + totalSourceWarnings}\``,
    "- This pack is the repo-owned shared memory between the prompt-level launcher and the repo-local runner.",
  ];

  const taskLines = [
    "# Task",
    "",
    "## Objective",
    "",
    `- Refresh or consume the handoff pack rooted at \`${currentPackRelativePath}\` without widening scope beyond the cross-agent subsystem unless the user explicitly asks.`,
    "",
    "## In Scope",
    "",
    "- The next concrete change to the shared handoff system.",
    "- Runner, skill, docs, tests, or pack updates directly required for that change.",
    "",
    "## Out of Scope",
    "",
    "- Unrelated application features or product work.",
    "- Automatic background execution or daemonization.",
    "",
    "## Next Steps",
    "",
    "- Replace these bullets with the exact next implementation steps before handing off.",
    "- Keep explicit references current and remove stale ones during the next refresh.",
    "",
    "## Verification",
    "",
    "- List the exact commands and manual checks the next agent must run.",
    "",
    "## Open Questions",
    "",
    "- Record any unresolved decisions here instead of burying them in transcript history.",
  ];

  const decisionsLines = [
    "# Decisions",
    "",
    "- The shared launcher name is `codex-antigravity-sync`.",
    "- The repo-local source of truth lives under `agents/codex-antigravity-sync/`.",
    "- The launcher is manual-only and wraps a repo-local runner; it is not a background daemon.",
    "- Current live conversation context wins over equivalent explicit references.",
    "- Explicit non-current references are opt-in only and are deduplicated by canonical identity.",
    "- Antigravity raw `.pb` files are recorded as opaque binary artifacts unless a schema is added later.",
  ];

  const filesLines = [
    "# Files To Read First",
    "",
    `1. \`${toRepoRelativePath(rootDir, resolveRepoPath(rootDir, path.join(CROSS_AGENT_CURRENT_DIR, "summary.md")))}\``,
    `2. \`${toRepoRelativePath(rootDir, resolveRepoPath(rootDir, path.join(CROSS_AGENT_CURRENT_DIR, "task.md")))}\``,
    `3. \`${toRepoRelativePath(rootDir, resolveRepoPath(rootDir, path.join(CROSS_AGENT_CURRENT_DIR, "decisions.md")))}\``,
    `4. \`${toRepoRelativePath(rootDir, resolveRepoPath(rootDir, path.join(CROSS_AGENT_CURRENT_DIR, "files.md")))}\``,
    `5. \`${toRepoRelativePath(rootDir, resolveRepoPath(rootDir, path.join(CROSS_AGENT_CURRENT_DIR, "status.md")))}\``,
    `6. \`${toRepoRelativePath(rootDir, resolveRepoPath(rootDir, path.join(CROSS_AGENT_CURRENT_DIR, "conversation-sources.json")))}\``,
    `7. \`${referencesDocRelativePath}\` for supported reference forms and runner behavior`,
    `8. \`${toRepoRelativePath(rootDir, resolveRepoPath(rootDir, path.join(CROSS_AGENT_CURRENT_DIR, "transcript.md")))}\` only when deeper context is needed`,
  ];

  const statusLines = [
    "# Status",
    "",
    `- Last sync completed: \`${importedAtIso}\``,
    `- Scan mode: \`${scanMode}\``,
    `- Archived previous pack: \`${archiveRelativePath}\``,
    `- Duplicates removed: \`${duplicatesRemoved.length}\``,
    `- Global warnings: \`${warnings.length}\``,
    "",
    "## Codex",
    "",
    `- Initialized: \`${automationState.tools.codex.initialized}\``,
    `- Last run at: \`${automationState.tools.codex.lastRunAt ?? "none"}\``,
    `- Last scan mode: \`${automationState.tools.codex.lastScanMode ?? "none"}\``,
    "",
    "## Antigravity",
    "",
    `- Initialized: \`${automationState.tools.antigravity.initialized}\``,
    `- Last run at: \`${automationState.tools.antigravity.lastRunAt ?? "none"}\``,
    `- Last scan mode: \`${automationState.tools.antigravity.lastScanMode ?? "none"}\``,
    "",
    "## Global Warnings",
    "",
    ...formatWarningLines(warnings),
  ];

  const transcriptSections = [
    "# Transcript",
    "",
    `- Refreshed at: \`${importedAtIso}\``,
    `- Invoking tool: \`${currentTool ?? "external"}\``,
    `- Scan mode: \`${scanMode}\``,
    `- Duplicates removed: \`${duplicatesRemoved.length}\``,
    "",
    ...sources.map((source, index) =>
      formatSourceTranscriptSection(source, source.role === "current" ? 0 : index)
    ),
  ];

  const provenanceLines = [
    "# Provenance",
    "",
    `- Generated by: \`${toRepoRelativePath(rootDir, resolveRepoPath(rootDir, path.join(CROSS_AGENT_AGENT_DIR, "runtime", SCRIPT_BASENAME)))}\``,
    `- Refreshed at: \`${importedAtIso}\``,
    `- Invoking tool: \`${currentTool ?? "external"}\``,
    `- Scan mode: \`${scanMode}\``,
    `- Archived previous pack: \`${archiveRelativePath}\``,
    `- Local config file: \`${configRelativePath}\``,
    "",
    "## Duplicates Removed",
    "",
    ...(duplicatesRemoved.length
      ? duplicatesRemoved.map(
          (duplicate) =>
            `- \`${duplicate.requestedReference ?? "current"}\` dropped as \`${duplicate.reason}\` against \`${duplicate.canonicalKey}\``
        )
      : ["- none"]),
    "",
    "## Raw .pb Artifacts",
    "",
  ];

  const pbArtifacts = sources.flatMap((source) =>
    source.artifacts.filter((artifact) => artifact.kind === "antigravity-pb")
  );

  provenanceLines.push(
    ...(pbArtifacts.length
      ? pbArtifacts.map(
          (artifact) =>
            `- \`${artifact.path}\` (${artifact.size} bytes, sha256: ${artifact.sha256}, parse status: ${artifact.parseAttempt.status})`
        )
      : ["- none"])
  );

  return {
    "summary.md": `${summaryLines.join("\n")}\n`,
    "task.md": `${taskLines.join("\n")}\n`,
    "decisions.md": `${decisionsLines.join("\n")}\n`,
    "files.md": `${filesLines.join("\n")}\n`,
    "status.md": `${statusLines.join("\n")}\n`,
    "transcript.md": `${transcriptSections.join("\n")}\n`,
    "provenance.md": `${provenanceLines.join("\n")}\n`,
    "automation-state.json": `${JSON.stringify(automationState, null, 2)}\n`,
    "conversation-sources.json": `${JSON.stringify(conversationSourcesState, null, 2)}\n`,
  };
}

function writeCurrentPack(currentDir, fileContentsByName) {
  fs.rmSync(currentDir, { recursive: true, force: true });
  ensureDirectory(currentDir);

  for (const fileName of CURRENT_PACK_FILES) {
    const fileContents = fileContentsByName[fileName];

    if (typeof fileContents !== "string") {
      throw new Error(`Missing generated content for ${fileName}`);
    }

    fs.writeFileSync(path.join(currentDir, fileName), fileContents, "utf8");
  }
}

function normalizeIncludeReferences(includeReferences) {
  if (!includeReferences) {
    return [];
  }

  return Array.isArray(includeReferences) ? includeReferences.filter(Boolean) : [includeReferences];
}

function updateAutomationState({ automationState, currentTool, importedAt, scanMode }) {
  const nextState = {
    ...automationState,
    lastDocsAuditAt: importedAt,
    lastRefreshAt: importedAt,
    tools: {
      ...automationState.tools,
    },
  };

  if (!currentTool) {
    return nextState;
  }

  const priorToolState = automationState.tools[currentTool] ?? {
    initialized: false,
    firstRunAt: null,
    lastRunAt: null,
    lastScanMode: null,
  };

  nextState.tools[currentTool] = {
    ...priorToolState,
    initialized: true,
    firstRunAt: priorToolState.initialized ? priorToolState.firstRunAt : importedAt,
    lastRunAt: importedAt,
    lastScanMode: scanMode,
  };

  return nextState;
}

export function syncCrossAgentPack({
  rootDir = process.cwd(),
  configPath,
  now = new Date(),
  currentTool = null,
  codexHome = DEFAULT_CODEX_HOME,
  antigravityHome = DEFAULT_ANTIGRAVITY_HOME,
  currentConversation = null,
  includeReferences = [],
  fullScan = false,
  dryRun = false,
} = {}) {
  const resolvedRootDir = resolveRootDir(rootDir);
  const currentDir = resolveRepoPath(resolvedRootDir, CROSS_AGENT_CURRENT_DIR);
  const archiveRootDir = resolveRepoPath(resolvedRootDir, CROSS_AGENT_ARCHIVE_DIR);
  const warnings = [];
  const loadedConfig = loadCrossAgentConfig({
    rootDir: resolvedRootDir,
    configPath,
    required: !currentTool,
  });

  const priorAutomationState = readAutomationState(currentDir, warnings);
  const scanMode = computeScanMode({
    currentTool,
    fullScan,
    automationState: priorAutomationState,
  });

  const resolvedSources = resolveConversationSources({
    currentTool,
    currentConversation,
    includeReferences: normalizeIncludeReferences(includeReferences),
    codexHome,
    antigravityHome,
    loadedConfig,
  });
  warnings.push(...resolvedSources.globalWarnings);

  const { keptReferences, duplicatesRemoved } = dedupeReferences(
    resolvedSources.currentSource,
    resolvedSources.referenceSources
  );
  const sources = [resolvedSources.currentSource, ...keptReferences];
  const timestamp = formatArchiveTimestamp(now);
  const archiveSlug =
    resolvedSources.currentSource.conversationId ??
    resolvedSources.currentSource.title ??
    path.basename(resolvedSources.currentSource.requestedReference ?? "transcript");
  const previewArchiveDir = currentPackHasFiles(currentDir)
    ? getArchiveDestination(path.join(archiveRootDir, `${timestamp}-${slugify(archiveSlug)}`))
    : null;
  const importedAtIso = toIsoString(now);
  const automationState = updateAutomationState({
    automationState: priorAutomationState,
    currentTool,
    importedAt: importedAtIso,
    scanMode,
  });
  const conversationSourcesState = buildConversationSourcesState({
    currentTool,
    scanMode,
    warnings,
    duplicatesRemoved,
    sources,
  });
  const fileContentsByName = buildCurrentPackFiles({
    rootDir: resolvedRootDir,
    importedAt: now,
    archiveDir: dryRun ? previewArchiveDir : null,
    config: loadedConfig,
    currentTool,
    scanMode,
    warnings,
    duplicatesRemoved,
    sources,
    automationState,
    conversationSourcesState,
  });

  let archiveDir = null;
  if (!dryRun) {
    archiveDir = archiveCurrentPack({
      currentDir,
      archiveRootDir,
      timestamp,
      slug: archiveSlug,
    });
    ensureDirectory(resolveRepoPath(resolvedRootDir, CROSS_AGENT_AGENT_DIR));
    ensureDirectory(archiveRootDir);
    writeCurrentPack(currentDir, fileContentsByName);
  }

  return {
    importedAt: importedAtIso,
    archiveDir,
    currentDir,
    configPath: loadedConfig?.configPath ?? null,
    scanMode,
    currentTool: currentTool ?? "external",
    dryRun,
    warnings,
    duplicatesRemoved,
    conversationSourcesPath: path.join(currentDir, "conversation-sources.json"),
    automationStatePath: path.join(currentDir, "automation-state.json"),
    conversationSourcesState,
    fileContentsByName,
    previewArchiveDir,
  };
}

export function getCrossAgentStatus({
  rootDir = process.cwd(),
  configPath,
} = {}) {
  const resolvedRootDir = resolveRootDir(rootDir);
  const currentDir = resolveRepoPath(resolvedRootDir, CROSS_AGENT_CURRENT_DIR);
  const archiveDir = resolveRepoPath(resolvedRootDir, CROSS_AGENT_ARCHIVE_DIR);
  const warnings = [];
  const configExists = fs.existsSync(resolveConfigPath(resolvedRootDir, configPath));
  const loadedConfig = configExists
    ? loadCrossAgentConfig({ rootDir: resolvedRootDir, configPath, required: false })
    : null;
  const automationState = readAutomationState(currentDir, warnings);
  let conversationSources = null;
  const conversationSourcesPath = path.join(currentDir, "conversation-sources.json");

  if (fs.existsSync(conversationSourcesPath)) {
    try {
      conversationSources = JSON.parse(fs.readFileSync(conversationSourcesPath, "utf8"));
    } catch (error) {
      pushWarning(
        warnings,
        "conversation-sources-invalid",
        "The current conversation-sources.json file is malformed.",
        { path: conversationSourcesPath, error: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  return {
    agentDir: resolveRepoPath(resolvedRootDir, CROSS_AGENT_AGENT_DIR),
    currentDir,
    archiveDir,
    configPath: resolveConfigPath(resolvedRootDir, configPath),
    configExists,
    transcriptDropFolder: loadedConfig?.transcriptDropFolder ?? null,
    currentPackExists: currentPackHasFiles(currentDir),
    automationState,
    conversationSources,
    warnings,
  };
}

export function parseCliArgs(argv) {
  const parsed = {
    includeReferences: [],
    fullScan: false,
    dryRun: false,
    status: false,
    currentConversation: {},
  };

  const requireValue = (flag, index) => {
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for ${flag}.`);
    }
    return value;
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--tool") {
      parsed.currentTool = requireValue(arg, index);
      index += 1;
      continue;
    }

    if (arg === "--full-scan") {
      parsed.fullScan = true;
      continue;
    }

    if (arg === "--include") {
      parsed.includeReferences.push(requireValue(arg, index));
      index += 1;
      continue;
    }

    if (arg === "--conversation-id") {
      parsed.currentConversation.conversationId = requireValue(arg, index);
      index += 1;
      continue;
    }

    if (arg === "--thread-title") {
      parsed.currentConversation.threadTitle = requireValue(arg, index);
      index += 1;
      continue;
    }

    if (arg === "--current-transcript-file") {
      const transcriptPath = requireValue(arg, index);
      if (!fs.existsSync(transcriptPath) || !fs.statSync(transcriptPath).isFile()) {
        throw new Error(`Current transcript file does not exist: ${transcriptPath}`);
      }
      parsed.currentConversation.transcriptContent = fs.readFileSync(transcriptPath, "utf8");
      index += 1;
      continue;
    }

    if (arg === "--codex-home") {
      parsed.codexHome = requireValue(arg, index);
      index += 1;
      continue;
    }

    if (arg === "--antigravity-home") {
      parsed.antigravityHome = requireValue(arg, index);
      index += 1;
      continue;
    }

    if (arg === "--config") {
      parsed.configPath = requireValue(arg, index);
      index += 1;
      continue;
    }

    if (arg === "--status") {
      parsed.status = true;
      continue;
    }

    if (arg === "--dry-run") {
      parsed.dryRun = true;
      continue;
    }

    throw new Error(`Unknown flag: ${arg}`);
  }

  if (parsed.currentTool && !ALLOWED_TOOLS.has(parsed.currentTool)) {
    throw new Error(`Unknown tool "${parsed.currentTool}". Expected one of: ${[...ALLOWED_TOOLS].join(", ")}`);
  }

  return parsed;
}

function printStatus(status, rootDir) {
  console.log(
    JSON.stringify(
      {
        ...status,
        agentDir: toRepoRelativePath(rootDir, status.agentDir),
        currentDir: toRepoRelativePath(rootDir, status.currentDir),
        archiveDir: toRepoRelativePath(rootDir, status.archiveDir),
        configPath: toRepoRelativePath(rootDir, status.configPath),
        transcriptDropFolder: status.transcriptDropFolder
          ? toRepoRelativePath(rootDir, status.transcriptDropFolder)
          : null,
      },
      null,
      2
    )
  );
}

function printSuccess(result, rootDir) {
  const output = [
    result.dryRun ? "Cross-agent pack dry-run complete." : "Cross-agent pack updated.",
    `Current pack: ${toRepoRelativePath(rootDir, result.currentDir)}`,
    `Invoking tool: ${result.currentTool}`,
    `Scan mode: ${result.scanMode}`,
    `Duplicates removed: ${result.duplicatesRemoved.length}`,
    `Warnings: ${result.warnings.length}`,
  ];

  if (result.dryRun) {
    output.push(`Would archive previous pack: ${toRepoRelativePath(rootDir, result.previewArchiveDir)}`);
  } else if (result.archiveDir) {
    output.push(`Archived previous pack: ${toRepoRelativePath(rootDir, result.archiveDir)}`);
  } else {
    output.push("Archived previous pack: none");
  }

  console.log(output.join("\n"));
}

async function main() {
  const cliOptions = parseCliArgs(process.argv.slice(2));
  if (cliOptions.status) {
    const status = getCrossAgentStatus(cliOptions);
    printStatus(status, resolveRootDir(process.cwd()));
    return;
  }

  const result = syncCrossAgentPack(cliOptions);
  printSuccess(result, resolveRootDir(process.cwd()));
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : null;
const isDirectExecution = invokedPath ? import.meta.url === pathToFileURL(invokedPath).href : false;

if (isDirectExecution) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
