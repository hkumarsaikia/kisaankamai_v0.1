import nextEnv from "@next/env";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import process from "node:process";

const require = createRequire(import.meta.url);
const nextBin = require.resolve("next/dist/bin/next");
const appDir = process.cwd();
const repoRoot = path.resolve(appDir, "..", "..");
const args = process.argv.slice(2);
const { loadEnvConfig } = nextEnv;

function loadPublicEnvFromAppHosting(configPath) {
  if (!fs.existsSync(configPath)) {
    return;
  }

  const lines = fs.readFileSync(configPath, "utf8").split(/\r?\n/);
  let currentVar = null;

  for (const line of lines) {
    const variableMatch = line.match(/^\s*-\s+variable:\s+(.+?)\s*$/);
    if (variableMatch) {
      currentVar = variableMatch[1];
      continue;
    }

    if (!currentVar) {
      continue;
    }

    const valueMatch = line.match(/^\s*value:\s*(.*)\s*$/);
    if (valueMatch) {
      const rawValue = valueMatch[1].replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
      if (!process.env[currentVar]) {
        process.env[currentVar] = rawValue;
      }
      currentVar = null;
      continue;
    }

    if (/^\s*secret:\s+/.test(line)) {
      currentVar = null;
    }
  }
}

// Load the shared repo env first, then let app-local env files override it.
loadEnvConfig(repoRoot);
loadEnvConfig(appDir);
loadPublicEnvFromAppHosting(path.join(appDir, "apphosting.yaml"));

const child = spawn(process.execPath, [nextBin, ...args], {
  cwd: appDir,
  env: process.env,
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
