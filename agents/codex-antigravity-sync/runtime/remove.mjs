import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { removeCrossAgentSkill } from "./install.mjs";

async function main() {
  const result = removeCrossAgentSkill();
  console.log(
    [
      "Cross-agent skill removed.",
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
