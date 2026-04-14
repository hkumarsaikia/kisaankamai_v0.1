import { mkdir, copyFile, rm } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";

const isPagesBuild = process.env.BUILD_TARGET === "pages";
const rootDir = process.cwd();
const liveActionPath = path.join(rootDir, "lib", "actions", "local-data.ts");
const demoActionPath = path.join(rootDir, "lib", "actions", "local-data.pages.ts");
const backupDir = path.join(rootDir, ".cache", "pages-build");
const backupActionPath = path.join(backupDir, "local-data.server.ts");

async function swapInPagesDemoActions() {
  await mkdir(backupDir, { recursive: true });
  await copyFile(liveActionPath, backupActionPath);
  await copyFile(demoActionPath, liveActionPath);
}

async function restoreServerActions() {
  try {
    await copyFile(backupActionPath, liveActionPath);
  } finally {
    await rm(backupActionPath, { force: true });
  }
}

function runNextBuild() {
  return new Promise((resolve, reject) => {
    const nextBinPath = path.join(rootDir, "node_modules", "next", "dist", "bin", "next");
    const child = spawn(process.execPath, [nextBinPath, "build"], {
      cwd: rootDir,
      env: process.env,
      stdio: "inherit",
    });

    child.on("exit", (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`next build exited with code ${code ?? "null"} and signal ${signal ?? "null"}`));
    });
    child.on("error", reject);
  });
}

try {
  if (isPagesBuild) {
    await swapInPagesDemoActions();
  }

  await runNextBuild();
} finally {
  if (isPagesBuild) {
    await restoreServerActions();
  }
}
