import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("shared skill docs expose the exact launcher name and manual invocation patterns", () => {
  const skillDoc = fs.readFileSync(new URL("../skill/SKILL.md", import.meta.url), "utf8");
  const codexDoc = fs.readFileSync(new URL("../skill/codex.md", import.meta.url), "utf8");
  const antigravityDoc = fs.readFileSync(new URL("../skill/antigravity.md", import.meta.url), "utf8");
  const referencesDoc = fs.readFileSync(new URL("../docs/REFERENCES.md", import.meta.url), "utf8");

  assert.match(skillDoc, /^name:\s*codex-antigravity-sync$/m);
  assert.match(skillDoc, /manual-only/i);
  assert.match(skillDoc, /full scan/i);
  assert.match(skillDoc, /include:/i);
  assert.match(skillDoc, /using-superpowers/i);
  assert.match(skillDoc, /subagent-driven-development/i);
  assert.match(codexDoc, /npm run cross-agent:sync -- --tool codex/i);
  assert.match(antigravityDoc, /npm run cross-agent:sync -- --tool antigravity/i);
  assert.match(referencesDoc, /thread id/i);
  assert.match(referencesDoc, /brain\/<uuid>/i);
  assert.match(referencesDoc, /\.pb/i);
  assert.match(referencesDoc, /exported transcript file path/i);
});
