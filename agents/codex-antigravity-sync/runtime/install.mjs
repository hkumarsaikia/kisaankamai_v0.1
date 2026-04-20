import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { CROSS_AGENT_SKILL_DIR, resolveRepoPath, resolveRootDir } from "./paths.mjs";

export const CROSS_AGENT_SKILL_NAME = "codex-antigravity-sync";
export const DEFAULT_CODEX_SKILLS_DIR = path.join(os.homedir(), ".agents", "skills");
export const DEFAULT_ANTIGRAVITY_SKILLS_DIR = path.join(os.homedir(), ".gemini", "antigravity", "skills");
export const DEFAULT_ANTIGRAVITY_SKILLS_MANIFEST_PATH = path.join(
  os.homedir(),
  ".gemini",
  "antigravity",
  "skills.txt"
);

function ensureDirectory(directoryPath) {
  fs.mkdirSync(directoryPath, { recursive: true });
}

function ensureSkillSourceExists(skillSourceDir) {
  const skillDocPath = path.join(skillSourceDir, "SKILL.md");

  if (!fs.existsSync(skillDocPath)) {
    throw new Error(`Missing shared skill source at ${skillDocPath}.`);
  }
}

function getPathLstat(linkPath) {
  try {
    return fs.lstatSync(linkPath);
  } catch {
    return null;
  }
}

function isExistingLink(linkPath) {
  return getPathLstat(linkPath)?.isSymbolicLink() ?? false;
}

function ensureJunction(linkPath, targetPath) {
  const currentLstat = getPathLstat(linkPath);

  if (currentLstat) {
    if (!isExistingLink(linkPath)) {
      throw new Error(`Refusing to replace non-link path: ${linkPath}`);
    }

    const desiredTarget = fs.realpathSync.native(targetPath);
    let currentTarget = null;

    try {
      currentTarget = fs.realpathSync.native(linkPath);
    } catch {
      currentTarget = null;
    }

    if (currentTarget === desiredTarget) {
      return;
    }

    fs.rmSync(linkPath, { recursive: true, force: true });
  }

  ensureDirectory(path.dirname(linkPath));
  fs.symlinkSync(targetPath, linkPath, "junction");
}

function safeRemoveLink(linkPath) {
  const currentLstat = getPathLstat(linkPath);

  if (!currentLstat) {
    return;
  }

  if (!isExistingLink(linkPath)) {
    throw new Error(`Refusing to remove non-link path: ${linkPath}`);
  }

  fs.rmSync(linkPath, { recursive: true, force: true });
}

function ensureManifestEntry(manifestPath, entryPath) {
  ensureDirectory(path.dirname(manifestPath));

  const existingLines = fs.existsSync(manifestPath)
    ? fs
        .readFileSync(manifestPath, "utf8")
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
    : [];

  const normalizedEntryPath = path.normalize(entryPath);
  const dedupedLines = existingLines.filter((line) => {
    const normalizedLine = path.normalize(line);
    return !normalizedLine.endsWith(path.normalize(`${CROSS_AGENT_SKILL_NAME}\\SKILL.md`));
  });
  dedupedLines.push(normalizedEntryPath);

  fs.writeFileSync(manifestPath, `${dedupedLines.join("\n")}${dedupedLines.length ? "\n" : ""}`, "utf8");
}

function removeManifestEntry(manifestPath, entryPath) {
  if (!fs.existsSync(manifestPath)) {
    return false;
  }

  const normalizedEntryPath = path.normalize(entryPath);
  const nextLines = fs
    .readFileSync(manifestPath, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => {
      if (!line) {
        return false;
      }

      const normalizedLine = path.normalize(line);
      return (
        normalizedLine !== normalizedEntryPath &&
        !normalizedLine.endsWith(path.normalize(`${CROSS_AGENT_SKILL_NAME}\\SKILL.md`))
      );
    });

  fs.writeFileSync(manifestPath, `${nextLines.join("\n")}${nextLines.length ? "\n" : ""}`, "utf8");
  return true;
}

export function installCrossAgentSkill({
  rootDir = process.cwd(),
  codexSkillsDir = DEFAULT_CODEX_SKILLS_DIR,
  antigravitySkillsDir = DEFAULT_ANTIGRAVITY_SKILLS_DIR,
  antigravitySkillsManifestPath = DEFAULT_ANTIGRAVITY_SKILLS_MANIFEST_PATH,
} = {}) {
  const resolvedRootDir = resolveRootDir(rootDir);
  const skillSourceDir = resolveRepoPath(resolvedRootDir, CROSS_AGENT_SKILL_DIR);
  const codexLinkPath = path.join(codexSkillsDir, CROSS_AGENT_SKILL_NAME);
  const antigravityLinkPath = path.join(antigravitySkillsDir, CROSS_AGENT_SKILL_NAME);
  const manifestEntryPath = path.join(skillSourceDir, "SKILL.md");

  ensureSkillSourceExists(skillSourceDir);
  ensureJunction(codexLinkPath, skillSourceDir);
  ensureJunction(antigravityLinkPath, skillSourceDir);
  ensureManifestEntry(antigravitySkillsManifestPath, manifestEntryPath);

  return {
    skillSourceDir,
    codexLinkPath,
    antigravityLinkPath,
    antigravitySkillsManifestPath,
    manifestEntryPath,
  };
}

export function removeCrossAgentSkill({
  rootDir = process.cwd(),
  codexSkillsDir = DEFAULT_CODEX_SKILLS_DIR,
  antigravitySkillsDir = DEFAULT_ANTIGRAVITY_SKILLS_DIR,
  antigravitySkillsManifestPath = DEFAULT_ANTIGRAVITY_SKILLS_MANIFEST_PATH,
} = {}) {
  const resolvedRootDir = resolveRootDir(rootDir);
  const skillSourceDir = resolveRepoPath(resolvedRootDir, CROSS_AGENT_SKILL_DIR);
  const codexLinkPath = path.join(codexSkillsDir, CROSS_AGENT_SKILL_NAME);
  const antigravityLinkPath = path.join(antigravitySkillsDir, CROSS_AGENT_SKILL_NAME);
  const manifestEntryPath = path.join(skillSourceDir, "SKILL.md");

  safeRemoveLink(codexLinkPath);
  safeRemoveLink(antigravityLinkPath);

  return {
    skillSourceDir,
    codexLinkPath,
    antigravityLinkPath,
    antigravitySkillsManifestPath,
    removedManifestEntry: removeManifestEntry(antigravitySkillsManifestPath, manifestEntryPath),
  };
}

async function main() {
  const result = installCrossAgentSkill();
  console.log(
    [
      "Cross-agent skill installed.",
      `Source: ${result.skillSourceDir}`,
      `Codex link: ${result.codexLinkPath}`,
      `Antigravity link: ${result.antigravityLinkPath}`,
      `Antigravity manifest: ${result.antigravitySkillsManifestPath}`,
    ].join("\n")
  );
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : null;
const isDirectExecution = invokedPath ? import.meta.url === pathToFileURL(invokedPath).href : false;

if (isDirectExecution) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
