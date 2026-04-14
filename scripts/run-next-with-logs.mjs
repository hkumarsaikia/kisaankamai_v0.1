import { mkdir } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

function readArgValue(args, longFlag, shortFlag, fallback) {
  const longIndex = args.findIndex((arg) => arg === longFlag);
  if (longIndex >= 0 && args[longIndex + 1]) {
    return args[longIndex + 1];
  }

  const shortIndex = args.findIndex((arg) => arg === shortFlag);
  if (shortIndex >= 0 && args[shortIndex + 1]) {
    return args[shortIndex + 1];
  }

  return fallback;
}

async function main() {
  const [, , mode = "dev", ...forwardedArgs] = process.argv;
  const nextBin = require.resolve("next/dist/bin/next");
  const logDir = path.join(process.cwd(), "logs", "runtime");
  const port = readArgValue(forwardedArgs, "--port", "-p", mode === "start" ? "3000" : "3000");
  const stem = mode === "start" ? `start-runtime-${port}` : `dev-runtime-${port}`;
  const outPath = path.join(logDir, `${stem}.log`);
  const errPath = path.join(logDir, `${stem}.err.log`);

  await mkdir(logDir, { recursive: true });

  const outStream = createWriteStream(outPath, { flags: "w" });
  const errStream = createWriteStream(errPath, { flags: "w" });
  const child = spawn(process.execPath, [nextBin, mode, ...forwardedArgs], {
    cwd: process.cwd(),
    env: process.env,
    stdio: ["inherit", "pipe", "pipe"],
  });

  console.log(`Writing runtime logs to ${path.relative(process.cwd(), outPath)} and ${path.relative(process.cwd(), errPath)}`);

  child.stdout.on("data", (chunk) => {
    process.stdout.write(chunk);
    outStream.write(chunk);
  });

  child.stderr.on("data", (chunk) => {
    process.stderr.write(chunk);
    errStream.write(chunk);
  });

  const shutdown = (signal) => {
    child.kill(signal);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  child.on("close", (code) => {
    outStream.end();
    errStream.end();
    process.exit(code ?? 0);
  });
}

main().catch((error) => {
  console.error("Could not start Next.js with log capture.", error);
  process.exit(1);
});
