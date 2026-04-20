import fs from "node:fs";
import path from "node:path";

export const RUNTIME_ROOT_DIR = path.join(process.cwd(), "logs", "runtime");
export const DEV_RUNTIME_DIR = path.join(RUNTIME_ROOT_DIR, "dev");
export const TUNNEL_RUNTIME_DIR = path.join(RUNTIME_ROOT_DIR, "tunnel");
export const CODEX_RUNTIME_DIR = path.join(RUNTIME_ROOT_DIR, "codex");

const FILE_DESTINATIONS = [
  [/^\.cloudflared-tunnel\./i, TUNNEL_RUNTIME_DIR],
  [/^\.codex-dev/i, CODEX_RUNTIME_DIR],
  [/^\.codex-dev2/i, CODEX_RUNTIME_DIR],
  [/^\.codex-verify-dev/i, CODEX_RUNTIME_DIR],
];

export function ensureRuntimeDirs() {
  for (const directory of [RUNTIME_ROOT_DIR, DEV_RUNTIME_DIR, TUNNEL_RUNTIME_DIR, CODEX_RUNTIME_DIR]) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

export function moveLegacyRootRuntimeFiles(rootDir = process.cwd()) {
  ensureRuntimeDirs();

  for (const fileName of fs.readdirSync(rootDir)) {
    const sourcePath = path.join(rootDir, fileName);
    if (!fs.statSync(sourcePath).isFile()) {
      continue;
    }

    const destinationDir = FILE_DESTINATIONS.find(([pattern]) => pattern.test(fileName))?.[1];
    if (!destinationDir) {
      continue;
    }

    const destinationPath = path.join(destinationDir, fileName);
    fs.rmSync(destinationPath, { force: true });
    fs.renameSync(sourcePath, destinationPath);
  }
}
