import fs from "node:fs";
import path from "node:path";
import dns from "node:dns";
import https from "node:https";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CACHE_DIR = path.join(ROOT_DIR, ".cache", "cloudflared");
const TUNNEL_LOG_PATH = path.join(ROOT_DIR, "tunnel.log");
const TUNNEL_STATE_PATH = path.join(CACHE_DIR, "public-tunnel-state.json");
const RUNTIME_LOG_PATHS = [
  path.join(ROOT_DIR, ".cache", "public-tunnel.stdout.log"),
  path.join(ROOT_DIR, ".cache", "public-tunnel.stderr.log")
];
const LOCAL_URL = "http://127.0.0.1:3000";
const TUNNEL_URL_PATTERN = /https:\/\/[a-z0-9-]+\.trycloudflare\.com/gi;
const CLOUDFLARED_RELEASE_BASE = "https://github.com/cloudflare/cloudflared/releases/latest/download";
const TUNNEL_READY_TIMEOUT_MS = 60_000;
const TUNNEL_READY_INTERVAL_MS = 2_000;
const CLOUDFLARE_DNS_API = "https://cloudflare-dns.com/dns-query";

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

const publicResolver = new dns.Resolver();
publicResolver.setServers(["1.1.1.1", "1.0.0.1"]);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const commandExists = (command) => {
  const lookupCommand = process.platform === "win32" ? "where" : "which";
  const result = spawnSync(lookupCommand, [command], { stdio: "ignore" });
  return result.status === 0;
};

const resolvePortableAsset = () => PORTABLE_ASSETS[process.platform]?.[process.arch] ?? null;

const getPortableBinaryPath = (binaryName) => path.join(CACHE_DIR, binaryName);

const ensureCacheDir = () => {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
};

const clearRuntimeFiles = () => {
  fs.rmSync(TUNNEL_LOG_PATH, { force: true });
  fs.rmSync(TUNNEL_STATE_PATH, { force: true });

  for (const logPath of RUNTIME_LOG_PATHS) {
    if (fs.existsSync(logPath)) {
      fs.writeFileSync(logPath, "", "utf8");
    }
  }
};

const writeTunnelLog = (url) => {
  fs.writeFileSync(TUNNEL_LOG_PATH, `${url}\n`, "utf8");
};

const writeTunnelState = (state) => {
  ensureCacheDir();
  fs.writeFileSync(TUNNEL_STATE_PATH, JSON.stringify(state, null, 2), "utf8");
};

const readTunnelState = () => {
  try {
    return JSON.parse(fs.readFileSync(TUNNEL_STATE_PATH, "utf8"));
  } catch {
    return null;
  }
};

const normalizeCommand = (command) => command.replaceAll("\\", "/").toLowerCase();

const isRepoOwnedTunnelCommand = (command) => {
  const normalized = normalizeCommand(command);
  const normalizedRoot = normalizeCommand(ROOT_DIR);

  if (normalized.includes("public-tunnel.mjs")) {
    return true;
  }

  if (normalized.includes("cloudflared") && normalized.includes("--url http://127.0.0.1:3000")) {
    return true;
  }

  return normalized.includes(normalizedRoot) && normalized.includes("cloudflared");
};

const parsePidLines = (text) =>
  text
    .split(/\r?\n/)
    .map((line) => Number.parseInt(line.trim(), 10))
    .filter((pid) => Number.isInteger(pid) && pid > 0);

const listRepoOwnedTunnelPids = () => {
  const pids = new Set();
  const savedState = readTunnelState();

  if (savedState?.helperPid) {
    pids.add(savedState.helperPid);
  }

  if (savedState?.childPid) {
    pids.add(savedState.childPid);
  }

  if (process.platform === "win32") {
    const powershellCommand = `
      Get-CimInstance Win32_Process |
      Where-Object {
        ($_.Name -eq 'node.exe' -and $_.CommandLine -match 'public-tunnel\\.mjs') -or
        ($_.Name -eq 'cloudflared.exe' -and $_.CommandLine -match '--url http://127\\.0\\.0\\.1:3000')
      } |
      Select-Object -ExpandProperty ProcessId
    `;

    const result = spawnSync("powershell", ["-NoProfile", "-Command", powershellCommand], {
      cwd: ROOT_DIR,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    });

    if (result.status === 0 && result.stdout) {
      for (const pid of parsePidLines(result.stdout)) {
        pids.add(pid);
      }
    }
  } else {
    const result = spawnSync("ps", ["-ax", "-o", "pid=,command="], {
      cwd: ROOT_DIR,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    });

    if (result.status === 0 && result.stdout) {
      for (const line of result.stdout.split(/\r?\n/)) {
        const match = line.trim().match(/^(\d+)\s+(.*)$/);
        if (!match) {
          continue;
        }

        const pid = Number.parseInt(match[1], 10);
        const command = match[2];

        if (pid > 0 && isRepoOwnedTunnelCommand(command)) {
          pids.add(pid);
        }
      }
    }
  }

  pids.delete(process.pid);
  return [...pids];
};

const killProcessTree = (pid) => {
  if (!pid || pid === process.pid) {
    return;
  }

  try {
    if (process.platform === "win32") {
      spawnSync("taskkill", ["/PID", String(pid), "/T", "/F"], { stdio: "ignore" });
      return;
    }

    process.kill(pid, "SIGTERM");
  } catch {
    // Process is already gone.
  }
};

const stopPreviousTunnelProcesses = async () => {
  const pids = listRepoOwnedTunnelPids();

  if (pids.length === 0) {
    return;
  }

  console.log(`Stopping ${pids.length} previous tunnel process${pids.length === 1 ? "" : "es"}...`);

  for (const pid of pids) {
    killProcessTree(pid);
  }

  await sleep(1_500);
};

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
  ensureCacheDir();

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

const spawnCleanupWatcher = () => {
  if (process.platform === "win32") {
    const escapePowerShellString = (value) => value.replaceAll("'", "''");
    const watcherCommand = `
      $helperPid = ${process.pid}
      $statePath = '${escapePowerShellString(TUNNEL_STATE_PATH)}'
      $tunnelLogPath = '${escapePowerShellString(TUNNEL_LOG_PATH)}'

      while (Get-Process -Id $helperPid -ErrorAction SilentlyContinue) {
        Start-Sleep -Milliseconds 1000
      }

      try {
        $state = Get-Content -LiteralPath $statePath -Raw | ConvertFrom-Json
        if ($null -eq $state -or [int]$state.helperPid -ne $helperPid) {
          exit 0
        }
      } catch {
        exit 0
      }

      Remove-Item -LiteralPath $tunnelLogPath -Force -ErrorAction SilentlyContinue
      Remove-Item -LiteralPath $statePath -Force -ErrorAction SilentlyContinue
    `;

    const watcher = spawn("powershell", ["-NoProfile", "-WindowStyle", "Hidden", "-Command", watcherCommand], {
      cwd: ROOT_DIR,
      detached: true,
      stdio: "ignore"
    });

    watcher.unref();
    return;
  }

  const watcherSource = `
    const fs = require("node:fs");
    const helperPid = Number(process.argv[1]);
    const statePath = process.argv[2];
    const tunnelLogPath = process.argv[3];

    const isHelperAlive = () => {
      try {
        process.kill(helperPid, 0);
        return true;
      } catch {
        return false;
      }
    };

    const cleanupIfStillOwned = () => {
      try {
        const state = JSON.parse(fs.readFileSync(statePath, "utf8"));
        if (state?.helperPid !== helperPid) {
          return;
        }
      } catch {
        return;
      }

      fs.rmSync(tunnelLogPath, { force: true });
      fs.rmSync(statePath, { force: true });
    };

    const timer = setInterval(() => {
      if (isHelperAlive()) {
        return;
      }

      clearInterval(timer);
      cleanupIfStillOwned();
      process.exit(0);
    }, 1000);

    timer.unref();
  `;

  const watcher = spawn(process.execPath, ["-e", watcherSource, String(process.pid), TUNNEL_STATE_PATH, TUNNEL_LOG_PATH], {
    cwd: ROOT_DIR,
    detached: true,
    stdio: "ignore"
  });

  watcher.unref();
};

const resolveViaDnsOverHttps = async (hostname, recordType) => {
  const response = await fetch(`${CLOUDFLARE_DNS_API}?name=${encodeURIComponent(hostname)}&type=${recordType}`, {
    headers: {
      accept: "application/dns-json"
    }
  });

  if (!response.ok) {
    throw new Error(`Cloudflare DNS lookup failed with status ${response.status}`);
  }

  const payload = await response.json();
  const answers = Array.isArray(payload?.Answer) ? payload.Answer : [];
  const matchingRecord = answers.find((answer) => typeof answer?.data === "string" && answer.type === recordType);

  if (!matchingRecord) {
    throw new Error(`No ${recordType === 1 ? "A" : "AAAA"} record published yet for ${hostname}`);
  }

  return matchingRecord.data;
};

const resolveTunnelHost = async (hostname) => {
  try {
    const address = await resolveViaDnsOverHttps(hostname, 1);
    return { address, family: 4 };
  } catch {
    // Fall through to IPv6 and local resolvers.
  }

  try {
    const address = await resolveViaDnsOverHttps(hostname, 28);
    return { address, family: 6 };
  } catch {
    // Fall through to local resolvers.
  }

  try {
    const addresses = await publicResolver.resolve4(hostname);
    if (addresses.length > 0) {
      return { address: addresses[0], family: 4 };
    }
  } catch {
    // Fall through to IPv6 and system DNS.
  }

  try {
    const addresses = await publicResolver.resolve6(hostname);
    if (addresses.length > 0) {
      return { address: addresses[0], family: 6 };
    }
  } catch {
    // Fall through to system DNS.
  }

  return dns.promises.lookup(hostname);
};

const requestTunnelUrl = (url, lookupResult) =>
  new Promise((resolve, reject) => {
    const targetUrl = new URL(url);
    const request = https.request(
      {
        hostname: targetUrl.hostname,
        servername: targetUrl.hostname,
        port: 443,
        path: `${targetUrl.pathname}${targetUrl.search}`,
        method: "GET",
        headers: {
          Host: targetUrl.hostname,
          "User-Agent": "kisan-kamai-public-tunnel-check"
        },
        lookup: (_hostname, options, callback) => {
          if (options?.all) {
            callback(null, [{ address: lookupResult.address, family: lookupResult.family }]);
            return;
          }

          callback(null, lookupResult.address, lookupResult.family);
        }
      },
      (response) => {
        response.resume();
        response.on("end", () => resolve(response.statusCode ?? 0));
      }
    );

    request.setTimeout(5_000, () => {
      request.destroy(new Error("Tunnel probe timed out"));
    });

    request.on("error", reject);
    request.end();
  });

const waitForReachableTunnelUrl = async (url) => {
  const deadline = Date.now() + TUNNEL_READY_TIMEOUT_MS;
  let lastFailure = "Cloudflare did not expose the tunnel URL yet.";

  while (Date.now() < deadline) {
    try {
      const lookupResult = await resolveTunnelHost(new URL(url).hostname);
      const statusCode = await requestTunnelUrl(url, lookupResult);

      if (statusCode >= 200 && statusCode < 400) {
        return;
      }

      lastFailure = `Tunnel probe returned status ${statusCode}.`;
    } catch (error) {
      lastFailure = error instanceof Error ? error.message : String(error);
    }

    await sleep(TUNNEL_READY_INTERVAL_MS);
  }

  throw new Error(lastFailure);
};

const main = async () => {
  const isLocalServerHealthy = await checkLocalServer();
  if (!isLocalServerHealthy) {
    console.error(`Dev server is not reachable at ${LOCAL_URL}. Start it first with "npm run dev:public".`);
    process.exit(1);
  }

  await stopPreviousTunnelProcesses();
  clearRuntimeFiles();

  const tunnelCommand = await resolveTunnelCommand();
  console.log(`Starting public tunnel via ${tunnelCommand.label}...`);

  const child = spawn(tunnelCommand.command, tunnelCommand.args, {
    cwd: ROOT_DIR,
    env: process.env,
    shell: process.platform === "win32" && tunnelCommand.command.endsWith(".cmd"),
    stdio: ["inherit", "pipe", "pipe"]
  });

  writeTunnelState({
    helperPid: process.pid,
    childPid: child.pid ?? null
  });
  spawnCleanupWatcher();

  let isShuttingDown = false;
  let verifiedShareUrl = null;
  let verificationPromise = null;
  let exitCode = 1;

  const cleanupRuntimeState = () => {
    clearRuntimeFiles();
  };

  process.on("exit", cleanupRuntimeState);

  const shutdownChild = (signal = "SIGTERM") => {
    isShuttingDown = true;

    if (child.exitCode === null && !child.killed) {
      child.kill(signal);
    }
  };

  const failAndStop = (message) => {
    console.error(message);
    exitCode = 1;
    shutdownChild("SIGTERM");
  };

  const handleOutput = (chunk, targetStream) => {
    const text = chunk.toString();
    targetStream.write(text);

    if (verificationPromise) {
      return;
    }

    const matches = text.match(TUNNEL_URL_PATTERN);
    const candidateUrl = matches?.[matches.length - 1];

    if (!candidateUrl) {
      return;
    }

    console.log(`Verifying tunnel URL before sharing it:\n${candidateUrl}`);

    verificationPromise = waitForReachableTunnelUrl(candidateUrl)
      .then(() => {
        if (isShuttingDown) {
          return;
        }

        verifiedShareUrl = candidateUrl;
        exitCode = 0;
        writeTunnelLog(candidateUrl);
        console.log(`\nTunnel URL is live and ready to share:\n${candidateUrl}\n`);
      })
      .catch((error) => {
        const message = error instanceof Error ? error.message : String(error);
        failAndStop(`Tunnel URL never became reachable: ${message}`);
      });
  };

  child.stdout.on("data", (chunk) => handleOutput(chunk, process.stdout));
  child.stderr.on("data", (chunk) => handleOutput(chunk, process.stderr));

  process.on("SIGINT", () => shutdownChild("SIGINT"));
  process.on("SIGTERM", () => shutdownChild("SIGTERM"));
  process.on("uncaughtException", (error) => failAndStop(`Tunnel helper crashed: ${error.message}`));
  process.on("unhandledRejection", (error) => {
    const message = error instanceof Error ? error.message : String(error);
    failAndStop(`Tunnel helper crashed: ${message}`);
  });

  child.on("error", (error) => {
    failAndStop(`Failed to start tunnel process: ${error.message}`);
  });

  child.on("exit", async (code, signal) => {
    if (verificationPromise) {
      try {
        await verificationPromise;
      } catch {
        // Failure already handled above.
      }
    }

    cleanupRuntimeState();

    if (isShuttingDown) {
      process.exit(exitCode);
    }

    if (signal) {
      console.error(`Tunnel process stopped with signal ${signal}.`);
      process.exit(1);
    }

    if (code !== 0) {
      console.error(`Tunnel process exited with code ${code}.`);
      process.exit(code ?? 1);
    }

    if (!verifiedShareUrl) {
      console.error("Tunnel process exited before the URL became reachable.");
      process.exit(1);
    }

    console.error("Tunnel process exited.");
    process.exit(1);
  });
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
