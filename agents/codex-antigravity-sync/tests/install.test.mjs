import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import {
  CROSS_AGENT_SKILL_NAME,
  installCrossAgentSkill,
  removeCrossAgentSkill,
} from "../runtime/install.mjs";

function makeTempRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "cross-agent-install-"));
}

function writeText(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, value, "utf8");
}

test("installCrossAgentSkill creates Codex and Antigravity junctions and keeps one manifest entry", () => {
  const rootDir = makeTempRoot();
  const codexSkillsDir = path.join(rootDir, "home", ".agents", "skills");
  const antigravitySkillsDir = path.join(rootDir, "home", ".gemini", "antigravity", "skills");
  const antigravitySkillsManifestPath = path.join(rootDir, "home", ".gemini", "antigravity", "skills.txt");

  writeText(
    path.join(rootDir, "agents", CROSS_AGENT_SKILL_NAME, "skill", "SKILL.md"),
    "---\nname: codex-antigravity-sync\n---\n"
  );
  writeText(
    antigravitySkillsManifestPath,
    [
      "C:\\temp\\unrelated\\SKILL.md",
      `C:\\old\\codex-antigravity-sync\\SKILL.md`,
      `C:\\old\\codex-antigravity-sync\\SKILL.md`,
    ].join("\n") + "\n"
  );

  const result = installCrossAgentSkill({
    rootDir,
    codexSkillsDir,
    antigravitySkillsDir,
    antigravitySkillsManifestPath,
  });

  const manifestContents = fs.readFileSync(antigravitySkillsManifestPath, "utf8").trim().split(/\r?\n/);
  const codexLinkPath = path.join(codexSkillsDir, CROSS_AGENT_SKILL_NAME);
  const antigravityLinkPath = path.join(antigravitySkillsDir, CROSS_AGENT_SKILL_NAME);

  assert.equal(fs.lstatSync(codexLinkPath).isSymbolicLink(), true);
  assert.equal(fs.lstatSync(antigravityLinkPath).isSymbolicLink(), true);
  assert.equal(result.codexLinkPath, codexLinkPath);
  assert.equal(result.antigravityLinkPath, antigravityLinkPath);
  assert.equal(manifestContents.filter((line) => line.includes("codex-antigravity-sync")).length, 1);
  assert.ok(manifestContents.some((line) => line.includes("unrelated")));
});

test("installCrossAgentSkill refuses to replace a non-link path", () => {
  const rootDir = makeTempRoot();
  const codexSkillsDir = path.join(rootDir, "home", ".agents", "skills");
  const antigravitySkillsDir = path.join(rootDir, "home", ".gemini", "antigravity", "skills");
  const antigravitySkillsManifestPath = path.join(rootDir, "home", ".gemini", "antigravity", "skills.txt");

  writeText(
    path.join(rootDir, "agents", CROSS_AGENT_SKILL_NAME, "skill", "SKILL.md"),
    "---\nname: codex-antigravity-sync\n---\n"
  );
  writeText(path.join(codexSkillsDir, CROSS_AGENT_SKILL_NAME, "placeholder.txt"), "not a link");
  writeText(antigravitySkillsManifestPath, "");

  assert.throws(
    () =>
      installCrossAgentSkill({
        rootDir,
        codexSkillsDir,
        antigravitySkillsDir,
        antigravitySkillsManifestPath,
      }),
    /Refusing to replace non-link path/i
  );
});

test("removeCrossAgentSkill removes installed junctions and the manifest entry only", () => {
  const rootDir = makeTempRoot();
  const codexSkillsDir = path.join(rootDir, "home", ".agents", "skills");
  const antigravitySkillsDir = path.join(rootDir, "home", ".gemini", "antigravity", "skills");
  const antigravitySkillsManifestPath = path.join(rootDir, "home", ".gemini", "antigravity", "skills.txt");

  writeText(
    path.join(rootDir, "agents", CROSS_AGENT_SKILL_NAME, "skill", "SKILL.md"),
    "---\nname: codex-antigravity-sync\n---\n"
  );
  writeText(antigravitySkillsManifestPath, "C:\\temp\\unrelated\\SKILL.md\n");

  installCrossAgentSkill({
    rootDir,
    codexSkillsDir,
    antigravitySkillsDir,
    antigravitySkillsManifestPath,
  });

  const result = removeCrossAgentSkill({
    rootDir,
    codexSkillsDir,
    antigravitySkillsDir,
    antigravitySkillsManifestPath,
  });

  assert.equal(fs.existsSync(path.join(codexSkillsDir, CROSS_AGENT_SKILL_NAME)), false);
  assert.equal(fs.existsSync(path.join(antigravitySkillsDir, CROSS_AGENT_SKILL_NAME)), false);
  assert.equal(fs.readFileSync(antigravitySkillsManifestPath, "utf8").includes("codex-antigravity-sync"), false);
  assert.equal(fs.readFileSync(antigravitySkillsManifestPath, "utf8").includes("unrelated"), true);
  assert.equal(result.removedManifestEntry, true);
});
