import os from "node:os";
import path from "node:path";

export const CROSS_AGENT_AGENT_DIR = path.join("agents", "codex-antigravity-sync");
export const CROSS_AGENT_DOCS_DIR = path.join(CROSS_AGENT_AGENT_DIR, "docs");
export const CROSS_AGENT_RUNTIME_DIR = path.join(CROSS_AGENT_AGENT_DIR, "runtime");
export const CROSS_AGENT_SKILL_DIR = path.join(CROSS_AGENT_AGENT_DIR, "skill");
export const CROSS_AGENT_STATE_DIR = path.join(CROSS_AGENT_AGENT_DIR, "state");
export const CROSS_AGENT_CURRENT_DIR = path.join(CROSS_AGENT_STATE_DIR, "current");
export const CROSS_AGENT_ARCHIVE_DIR = path.join(CROSS_AGENT_STATE_DIR, "archive");
export const CROSS_AGENT_TEMPLATES_DIR = path.join(CROSS_AGENT_AGENT_DIR, "templates");
export const CROSS_AGENT_CONFIG_DIR = path.join(CROSS_AGENT_AGENT_DIR, "config");

export const CURRENT_PACK_MARKDOWN_FILES = [
  "summary.md",
  "task.md",
  "decisions.md",
  "files.md",
  "status.md",
  "transcript.md",
  "provenance.md",
];
export const CURRENT_PACK_STATE_FILES = ["automation-state.json", "conversation-sources.json"];
export const CURRENT_PACK_FILES = [...CURRENT_PACK_MARKDOWN_FILES, ...CURRENT_PACK_STATE_FILES];

export const DEFAULT_CONFIG_FILE = path.join(CROSS_AGENT_CONFIG_DIR, "local.json");
export const DEFAULT_CONFIG_EXAMPLE_FILE = path.join(CROSS_AGENT_CONFIG_DIR, "local.example.json");
export const DEFAULT_TRANSCRIPT_EXTENSIONS = [".md", ".markdown", ".txt", ".log", ".json"];
export const DEFAULT_CODEX_HOME = path.join(os.homedir(), ".codex");
export const DEFAULT_ANTIGRAVITY_HOME = path.join(os.homedir(), ".gemini", "antigravity");

export function resolveRootDir(rootDir) {
  return path.resolve(rootDir ?? process.cwd());
}

export function resolveRepoPath(rootDir, relativePath) {
  return path.join(resolveRootDir(rootDir), relativePath);
}

export function toRepoRelativePath(rootDir, targetPath) {
  if (!targetPath) {
    return "none";
  }

  const resolvedRootDir = resolveRootDir(rootDir);
  const resolvedTargetPath = path.resolve(targetPath);
  const relativePath = path.relative(resolvedRootDir, resolvedTargetPath);

  if (!relativePath.startsWith("..") && !path.isAbsolute(relativePath)) {
    return relativePath === "" ? "." : relativePath.replaceAll("\\", "/");
  }

  return resolvedTargetPath.replaceAll("\\", "/");
}
