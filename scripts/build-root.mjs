import path from "node:path";
import { spawn } from "node:child_process";

const rootDir = process.cwd();

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

await runNextBuild();
