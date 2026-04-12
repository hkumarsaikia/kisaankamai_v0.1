import fs from "node:fs";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CACHE_DIR = path.join(ROOT_DIR, ".cache", "cloudflared");
const TUNNEL_LOG_PATH = path.join(ROOT_DIR, "tunnel.log");
const LOCAL_URL = "http://127.0.0.1:3000";
const TUNNEL_URL_PATTERN = /https:\/\/[a-z0-9-]+\.trycloudflare\.com/gi;
const CLOUDFLARED_RELEASE_BASE = "https://github.com/cloudflare/cloudflared/releases/latest/download";

const PORTABLE_ASSETS = {
  win32: {
    x64: { assetName: "cloudflared-windows-amd64.exe", binaryName: "cloudflared.exe" },
    arm64: { assetName: "cloudflared-windows-amd64.exe", binaryName: "cloudflared.exe" }
  },
  linux: {
    x64: { assetName: "cloudflared-linux-amd64", binaryName: "cloudflared" },
    arm64: { assetName: "cloudflared-linux-arm64", binaryName: "cloudflared" }
  },
  darwin: {
    x64: { assetName: "cloudflared-darwin-amd64.tgz", binaryName: "cloudflared" },
    arm64: { assetName: "cloudflared-darwin-arm64.tgz", binaryName: "cloudflared" }
  }
};

const commandExists = (command) => {
  const lookupCommand = process.platform === "win32" ? "where" : "which";
  const result = spawnSync(lookupCommand, [command], { stdio: "ignore" });
  return result.status === 0;
};

const resolvePortableAsset = () => PORTABLE_ASSETS[process.platform]?.[process.arch] ?? null;

const getPortableBinaryPath = (binaryName) => path.join(CACHE_DIR, binaryName);

const downloadFile = async (url, destinationPath) => {
  const response = await fetch(url);
  if (!response.ok || !response.body) {
    throw new Error(`Download failed with status ${response.status} for ${url}`);
  }

  await pipeline(Readable.fromWeb(response.body), fs.createWriteStream(destinationPath));
};

const verifyPortableBinary = (binaryPath) => {
  const result = spawnSync(binaryPath, ["--version"], { stdio: "ignore" });
  return result.status === 0;
};

const downloadPortableCloudflared = async (asset) => {
  fs.mkdirSync(CACHE_DIR, { recursive: true });

  const downloadPath = path.join(CACHE_DIR, asset.assetName);
  const binaryPath = getPortableBinaryPath(asset.binaryName);
  const assetUrl = `${CLOUDFLARED_RELEASE_BASE}/${asset.assetName}`;

  console.log(`Downloading Cloudflare tunnel binary (${asset.assetName})...`);
  await downloadFile(assetUrl, downloadPath);

  if (asset.assetName.endsWith(".tgz")) {
    const extractionResult = spawnSync("tar", ["-xzf", downloadPath, "-C", CACHE_DIR], { stdio: "inherit" });
    fs.rmSync(downloadPath, { force: true });
    if (extractionResult.status !== 0) {
      throw new Error(`Failed to extract ${asset.assetName}`);
    }
  } else if (downloadPath !== binaryPath) {
    fs.renameSync(downloadPath, binaryPath);
  }

  if (!fs.existsSync(binaryPath)) {
    throw new Error(`Portable cloudflared binary was not created at ${binaryPath}`);
  }

  if (process.platform !== "win32") {
    fs.chmodSync(binaryPath, 0o755);
  }

  if (!verifyPortableBinary(binaryPath)) {
    throw new Error("Downloaded cloudflared binary did not pass verification");
  }

  return binaryPath;
};

const ensurePortableCloudflared = async () => {
  const asset = resolvePortableAsset();
  if (!asset) {
    return null;
  }

  const binaryPath = getPortableBinaryPath(asset.binaryName);
  if (fs.existsSync(binaryPath) && verifyPortableBinary(binaryPath)) {
    return binaryPath;
  }

  return downloadPortableCloudflared(asset);
};

const resolveTunnelCommand = async () => {
  if (commandExists("cloudflared")) {
    return {
      command: "cloudflared",
      args: ["tunnel", "--url", LOCAL_URL],
      label: "cloudflared"
    };
  }

  try {
    const portableBinaryPath = await ensurePortableCloudflared();
    if (portableBinaryPath) {
      return {
        command: portableBinaryPath,
        args: ["tunnel", "--url", LOCAL_URL],
        label: "portable cloudflared"
      };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`Portable cloudflared setup failed: ${message}`);
    console.warn("Falling back to Wrangler quick tunnel.");
  }

  return {
    command: process.platform === "win32" ? "npx.cmd" : "npx",
    args: ["--yes", "wrangler@latest", "tunnel", "quick-start", LOCAL_URL],
    label: "wrangler quick tunnel"
  };
};

const checkLocalServer = async () => {
  try {
    const response = await fetch(LOCAL_URL, { method: "GET" });
    return response.ok;
  } catch {
    return false;
  }
};

const writeTunnelLog = (url) => {
  fs.writeFileSync(TUNNEL_LOG_PATH, `${url}\n`, "utf8");
};

const main = async () => {
  const isLocalServerHealthy = await checkLocalServer();
  if (!isLocalServerHealthy) {
    console.error(`Dev server is not reachable at ${LOCAL_URL}. Start it first with "npm run dev:public".`);
    process.exit(1);
  }

  const tunnelCommand = await resolveTunnelCommand();
  fs.writeFileSync(TUNNEL_LOG_PATH, "", "utf8");
  console.log(`Starting public tunnel via ${tunnelCommand.label}...`);

  const child = spawn(tunnelCommand.command, tunnelCommand.args, {
    cwd: ROOT_DIR,
    env: process.env,
    shell: process.platform === "win32" && tunnelCommand.command.endsWith(".cmd"),
    stdio: ["inherit", "pipe", "pipe"]
  });

  let hasPrintedShareUrl = false;
  let isShuttingDown = false;

  const handleOutput = (chunk, targetStream) => {
    const text = chunk.toString();
    targetStream.write(text);

    const matches = text.match(TUNNEL_URL_PATTERN);
    const liveUrl = matches?.[matches.length - 1];

    if (liveUrl && !hasPrintedShareUrl) {
      hasPrintedShareUrl = true;
      writeTunnelLog(liveUrl);
      console.log(`\nShare this URL while this command stays running:\n${liveUrl}\n`);
    }
  };

  child.stdout.on("data", (chunk) => handleOutput(chunk, process.stdout));
  child.stderr.on("data", (chunk) => handleOutput(chunk, process.stderr));

  const shutdownChild = (signal) => {
    isShuttingDown = true;
    if (!child.killed) {
      child.kill(signal);
    }
  };

  process.on("SIGINT", () => shutdownChild("SIGINT"));
  process.on("SIGTERM", () => shutdownChild("SIGTERM"));

  child.on("error", (error) => {
    console.error(`Failed to start tunnel process: ${error.message}`);
    process.exit(1);
  });

  child.on("exit", (code, signal) => {
    if (isShuttingDown) {
      process.exit(0);
    }

    if (signal) {
      console.error(`Tunnel process stopped with signal ${signal}.`);
      process.exit(1);
    }

    if (code !== 0) {
      console.error(`Tunnel process exited with code ${code}.`);
      process.exit(code ?? 1);
    }

    console.error("Tunnel process exited.");
    process.exit(1);
  });
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
