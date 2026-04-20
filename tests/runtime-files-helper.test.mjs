import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

async function withIsolatedRuntimeModule(run) {
  const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const originalCwd = process.cwd();
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "kk-runtime-files-"));

  try {
    process.chdir(tempRoot);

    const modulePath = path.join(repoRoot, "scripts", "runtime-files.mjs");
    const runtimeFiles = await import(`${pathToFileURL(modulePath).href}?ts=${Date.now()}-${Math.random()}`);

    await run({ runtimeFiles, tempRoot });
  } finally {
    process.chdir(originalCwd);
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

test("moveLegacyRootRuntimeFiles creates runtime folders and relocates only managed root logs", async () => {
  await withIsolatedRuntimeModule(async ({ runtimeFiles, tempRoot }) => {
    fs.writeFileSync(path.join(tempRoot, ".cloudflared-tunnel.out.log"), "tunnel-log", "utf8");
    fs.writeFileSync(path.join(tempRoot, ".codex-dev.out.log"), "dev-log", "utf8");
    fs.writeFileSync(path.join(tempRoot, ".codex-verify-dev.pid"), "12345", "utf8");
    fs.writeFileSync(path.join(tempRoot, "notes.txt"), "keep-me", "utf8");

    runtimeFiles.moveLegacyRootRuntimeFiles(tempRoot);

    assert.equal(fs.existsSync(path.join(tempRoot, ".cloudflared-tunnel.out.log")), false);
    assert.equal(fs.existsSync(path.join(tempRoot, ".codex-dev.out.log")), false);
    assert.equal(fs.existsSync(path.join(tempRoot, ".codex-verify-dev.pid")), false);
    assert.equal(
      fs.readFileSync(path.join(runtimeFiles.TUNNEL_RUNTIME_DIR, ".cloudflared-tunnel.out.log"), "utf8"),
      "tunnel-log"
    );
    assert.equal(
      fs.readFileSync(path.join(runtimeFiles.CODEX_RUNTIME_DIR, ".codex-dev.out.log"), "utf8"),
      "dev-log"
    );
    assert.equal(
      fs.readFileSync(path.join(runtimeFiles.CODEX_RUNTIME_DIR, ".codex-verify-dev.pid"), "utf8"),
      "12345"
    );
    assert.equal(fs.readFileSync(path.join(tempRoot, "notes.txt"), "utf8"), "keep-me");
    assert.equal(fs.existsSync(runtimeFiles.DEV_RUNTIME_DIR), true);
  });
});

test("moveLegacyRootRuntimeFiles replaces stale runtime copies on repeat runs", async () => {
  await withIsolatedRuntimeModule(async ({ runtimeFiles, tempRoot }) => {
    runtimeFiles.ensureRuntimeDirs();
    fs.writeFileSync(path.join(runtimeFiles.CODEX_RUNTIME_DIR, ".codex-dev2.err.log"), "stale", "utf8");
    fs.writeFileSync(path.join(tempRoot, ".codex-dev2.err.log"), "fresh", "utf8");

    runtimeFiles.moveLegacyRootRuntimeFiles(tempRoot);

    assert.equal(fs.existsSync(path.join(tempRoot, ".codex-dev2.err.log")), false);
    assert.equal(
      fs.readFileSync(path.join(runtimeFiles.CODEX_RUNTIME_DIR, ".codex-dev2.err.log"), "utf8"),
      "fresh"
    );
  });
});
