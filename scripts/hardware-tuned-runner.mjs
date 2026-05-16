import { spawn } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const rootDir = process.cwd();

const PROFILES = new Set([
  "exec",
  "dev",
  "dev:public",
  "dev:logged",
  "start",
  "start:logged",
  "build",
  "lint",
  "typecheck",
  "test:contracts",
  "verify",
  "launch:gate",
]);

function parsePositiveInt(value) {
  if (!value) {
    return null;
  }
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function detectHardware() {
  const logicalCores =
    typeof os.availableParallelism === "function"
      ? os.availableParallelism()
      : os.cpus().length || 2;
  const totalMemoryMb = Math.max(1024, Math.floor(os.totalmem() / 1024 / 1024));
  const mode = String(process.env.KK_CPU_MODE || "balanced").toLowerCase();
  const reservedCores =
    mode === "performance"
      ? 1
      : mode === "eco"
        ? Math.max(3, Math.ceil(logicalCores * 0.5))
        : Math.max(2, Math.ceil(logicalCores * 0.25));
  const detectedWorkers = Math.max(1, logicalCores - reservedCores);
  const maxWorkers = parsePositiveInt(process.env.KK_MAX_WORKERS);
  const workers = Math.max(1, Math.min(logicalCores, maxWorkers || detectedWorkers));
  const testConcurrency =
    parsePositiveInt(process.env.KK_TEST_CONCURRENCY) ||
    Math.max(2, Math.min(6, workers - 2 || workers));
  const nodeMemoryMb =
    parsePositiveInt(process.env.KK_NODE_MEMORY_MB) ||
    Math.max(2048, Math.min(8192, Math.floor(totalMemoryMb * 0.55)));

  return {
    logicalCores,
    mode,
    nodeMemoryMb,
    testConcurrency,
    totalMemoryMb,
    workers,
  };
}

const hardware = detectHardware();
const CHROME_NVIDIA_GPU_ARGS = [
  "--ignore-gpu-blocklist",
  "--enable-gpu-rasterization",
  "--enable-zero-copy",
  "--enable-accelerated-2d-canvas",
  "--enable-accelerated-video-decode",
  "--use-gl=desktop",
  "--disable-software-rasterizer",
];
const DEFAULT_CHROME_PATH = "/usr/bin/google-chrome";
const NVIDIA_EGL_VENDOR_FILE = "/usr/share/glvnd/egl_vendor.d/10_nvidia.json";

function resolveChromeExecutablePath() {
  return process.env.PUPPETEER_EXECUTABLE_PATH || process.env.CHROME_BIN || DEFAULT_CHROME_PATH;
}

function mergeNodeOptions(baseOptions, memoryMb) {
  const current = String(baseOptions || "").trim();
  if (/\b--max-old-space-size=/.test(current)) {
    return current;
  }
  return `${current ? `${current} ` : ""}--max-old-space-size=${memoryMb}`.trim();
}

function tunedEnv(extra = {}) {
  const optionalNvidiaEnv = existsSync(NVIDIA_EGL_VENDOR_FILE)
    ? { __EGL_VENDOR_LIBRARY_FILENAMES: NVIDIA_EGL_VENDOR_FILE }
    : {};

  return {
    ...process.env,
    NEXT_TELEMETRY_DISABLED: process.env.NEXT_TELEMETRY_DISABLED || "1",
    NODE_OPTIONS: mergeNodeOptions(process.env.NODE_OPTIONS, hardware.nodeMemoryMb),
    UV_THREADPOOL_SIZE: String(
      Math.max(4, Math.min(128, parsePositiveInt(process.env.UV_THREADPOOL_SIZE) || hardware.workers))
    ),
    KK_GPU_MODE: "nvidia-fixed",
    KK_NVIDIA_GPU_REQUIRED: "1",
    CUDA_DEVICE_ORDER: "PCI_BUS_ID",
    CUDA_VISIBLE_DEVICES: "0",
    NVIDIA_VISIBLE_DEVICES: "all",
    NVIDIA_DRIVER_CAPABILITIES: "all",
    PYTORCH_NVML_BASED_CUDA_CHECK: "1",
    KK_CHROME_GPU_ARGS: CHROME_NVIDIA_GPU_ARGS.join(" "),
    PUPPETEER_EXECUTABLE_PATH: resolveChromeExecutablePath(),
    CHROME_BIN: resolveChromeExecutablePath(),
    BROWSER: resolveChromeExecutablePath(),
    __NV_PRIME_RENDER_OFFLOAD: "1",
    __GLX_VENDOR_LIBRARY_NAME: "nvidia",
    __VK_LAYER_NV_optimus: "NVIDIA_only",
    DRI_PRIME: "1",
    LIBVA_DRIVER_NAME: "nvidia",
    ...optionalNvidiaEnv,
    KK_DETECTED_LOGICAL_CORES: String(hardware.logicalCores),
    KK_DETECTED_WORKERS: String(hardware.workers),
    KK_DETECTED_MEMORY_MB: String(hardware.totalMemoryMb),
    ...extra,
  };
}

function wrapForSystemHealth(command, args) {
  if (process.platform !== "linux" || process.env.KK_DISABLE_NICE === "1") {
    return { command, args };
  }

  const niceValue = process.env.KK_NICE || "5";
  const ioniceClass = process.env.KK_IONICE_CLASS || "2";
  const ionicePriority = process.env.KK_IONICE_PRIORITY || "4";

  if (existsSync("/usr/bin/ionice")) {
    return {
      command: "ionice",
      args: ["-c", ioniceClass, "-n", ionicePriority, "nice", "-n", niceValue, command, ...args],
    };
  }

  if (existsSync("/usr/bin/nice")) {
    return {
      command: "nice",
      args: ["-n", niceValue, command, ...args],
    };
  }

  return { command, args };
}

function nodeScript(modulePath, args = []) {
  return {
    command: process.execPath,
    args: [modulePath, ...args],
  };
}

function nodePackageBin(packageBinPath, args = []) {
  return nodeScript(path.join(rootDir, "node_modules", packageBinPath), args);
}

function resolveNextBin() {
  return require.resolve("next/dist/bin/next");
}

function resolveFirebaseCommand() {
  const localFirebase = path.join(rootDir, "node_modules", ".bin", "firebase");
  return existsSync(localFirebase) ? localFirebase : "firebase";
}

function contractTestFiles() {
  return readdirSync(path.join(rootDir, "tests"))
    .filter((fileName) => fileName.endsWith(".test.mjs"))
    .sort()
    .map((fileName) => path.join("tests", fileName));
}

function logProfile(profile) {
  if (process.env.KK_QUIET_HARDWARE_PROFILE === "1") {
    return;
  }

  console.log(
    `[hardware-tuned] ${profile}: mode=${hardware.mode} gpu=nvidia-fixed logical=${hardware.logicalCores} workers=${hardware.workers} testConcurrency=${hardware.testConcurrency} nodeMemory=${hardware.nodeMemoryMb}MB`
  );
}

function runCommand(profile, commandSpec, options = {}) {
  return new Promise((resolve, reject) => {
    const { command, args } = wrapForSystemHealth(commandSpec.command, commandSpec.args || []);
    const child = spawn(command, args, {
      cwd: rootDir,
      env: tunedEnv(options.env),
      stdio: options.stdio || "inherit",
    });

    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${profile} exited with code ${code ?? "null"} and signal ${signal ?? "null"}`));
    });
  });
}

async function runProfile(profile, forwardedArgs = []) {
  logProfile(profile);

  switch (profile) {
    case "dev":
      return runCommand(profile, nodeScript(resolveNextBin(), ["dev", ...forwardedArgs]));
    case "dev:public":
      return runCommand(
        profile,
        nodeScript(resolveNextBin(), ["dev", "--hostname", "0.0.0.0", "--port", "3000", ...forwardedArgs])
      );
    case "dev:logged":
      return runCommand(profile, nodeScript(path.join(rootDir, "scripts", "run-next-with-logs.mjs"), ["dev", ...forwardedArgs]));
    case "start":
      return runCommand(profile, nodeScript(resolveNextBin(), ["start", ...forwardedArgs]));
    case "start:logged":
      return runCommand(profile, nodeScript(path.join(rootDir, "scripts", "run-next-with-logs.mjs"), ["start", ...forwardedArgs]));
    case "build":
      return runCommand(profile, nodeScript(path.join(rootDir, "scripts", "build-root.mjs"), forwardedArgs));
    case "lint":
      return runCommand(
        profile,
        nodePackageBin("eslint/bin/eslint.js", [
          "--cache",
          "--cache-location",
          ".cache/eslint/",
          ".",
          ...forwardedArgs,
        ])
      );
    case "typecheck":
      return runCommand(
        profile,
        nodePackageBin("typescript/bin/tsc", [
          "--noEmit",
          "--incremental",
          "false",
          "-p",
          "tsconfig.typecheck.json",
          ...forwardedArgs,
        ])
      );
    case "test:contracts":
      return runCommand(
        profile,
        {
          command: process.execPath,
          args: [
            "--test",
            "--test-concurrency",
            String(hardware.testConcurrency),
            ...contractTestFiles(),
            ...forwardedArgs,
          ],
        }
      );
    case "verify":
      return runVerify(forwardedArgs);
    case "launch:gate":
      return runLaunchGate(forwardedArgs);
    case "exec":
      return runExec(forwardedArgs);
    default:
      throw new Error(`Unknown hardware-tuned profile: ${profile}`);
  }
}

async function runExec(forwardedArgs = []) {
  const [command, ...args] = forwardedArgs;
  if (!command) {
    throw new Error("Usage: node scripts/hardware-tuned-runner.mjs exec <command> [...args]");
  }

  return runCommand("exec", { command, args });
}

async function runVerify(forwardedArgs = []) {
  if (process.env.KK_VERIFY_SEQUENTIAL === "1") {
    await runProfile("lint", forwardedArgs);
    await runProfile("typecheck", forwardedArgs);
    await runProfile("build", forwardedArgs);
    await runProfile("test:contracts", forwardedArgs);
    return;
  }

  await Promise.all([
    runProfile("lint", forwardedArgs),
    runProfile("typecheck", forwardedArgs),
    runProfile("test:contracts", forwardedArgs),
  ]);
  await runProfile("build", forwardedArgs);
}

async function runLaunchGate(forwardedArgs = []) {
  await runVerify(forwardedArgs);
  await runCommand("firebase:preflight", nodeScript(path.join(rootDir, "scripts", "firebase-preflight.mjs")));
  await runCommand("firebase:rules:dry-run", {
    command: resolveFirebaseCommand(),
    args: ["deploy", "--only", "firestore,storage", "--project", "gokisaan", "--dry-run", "--debug"],
  });
  await runCommand("sheets:verify", nodeScript(path.join(rootDir, "scripts", "google-sheets-verify.mjs")));
}

async function main() {
  const [, , profile = "", ...forwardedArgs] = process.argv;
  if (!PROFILES.has(profile)) {
    console.error(`Usage: node scripts/hardware-tuned-runner.mjs <${[...PROFILES].join("|")}> [args...]`);
    process.exit(1);
  }

  await runProfile(profile, forwardedArgs);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
