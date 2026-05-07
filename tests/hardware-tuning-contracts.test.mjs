import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

async function readSource(path) {
  return readFile(new URL(path, import.meta.url), "utf8");
}

test("npm commands route through the hardware tuned runner", async () => {
  const packageJson = JSON.parse(await readSource("../package.json"));

  assert.equal(packageJson.scripts.dev, "node scripts/hardware-tuned-runner.mjs dev");
  assert.equal(packageJson.scripts["dev:public"], "node scripts/hardware-tuned-runner.mjs dev:public");
  assert.equal(packageJson.scripts.build, "node scripts/hardware-tuned-runner.mjs build");
  assert.equal(packageJson.scripts.lint, "node scripts/hardware-tuned-runner.mjs lint");
  assert.equal(packageJson.scripts.typecheck, "node scripts/hardware-tuned-runner.mjs typecheck");
  assert.equal(packageJson.scripts["test:contracts"], "node scripts/hardware-tuned-runner.mjs test:contracts");
  assert.equal(packageJson.scripts.verify, "node scripts/hardware-tuned-runner.mjs verify");
  assert.equal(packageJson.scripts["launch:gate"], "node scripts/hardware-tuned-runner.mjs launch:gate");
});

test("hardware tuned runner uses adaptive CPU and health controls", async () => {
  const runner = await readSource("../scripts/hardware-tuned-runner.mjs");

  assert.match(runner, /availableParallelism/);
  assert.match(runner, /KK_CPU_MODE/);
  assert.match(runner, /KK_MAX_WORKERS/);
  assert.match(runner, /KK_DISABLE_NICE/);
  assert.match(runner, /UV_THREADPOOL_SIZE/);
  assert.match(runner, /NODE_OPTIONS/);
  assert.match(runner, /--test-concurrency/);
  assert.match(runner, /--cache-location/);
  assert.match(runner, /runVerify/);
  assert.match(runner, /runLaunchGate/);
  assert.match(runner, /ionice/);
  assert.match(runner, /nice/);
});

test("hardware tuned runner forces the NVIDIA GPU for browser-capable work", async () => {
  const [runner, development] = await Promise.all([
    readSource("../scripts/hardware-tuned-runner.mjs"),
    readSource("../docs/DEVELOPMENT.md"),
  ]);

  assert.match(runner, /KK_GPU_MODE/);
  assert.match(runner, /nvidia-fixed/);
  assert.match(runner, /__NV_PRIME_RENDER_OFFLOAD/);
  assert.match(runner, /__GLX_VENDOR_LIBRARY_NAME/);
  assert.match(runner, /__VK_LAYER_NV_optimus/);
  assert.match(runner, /DRI_PRIME/);
  assert.match(runner, /PUPPETEER_EXECUTABLE_PATH/);
  assert.match(runner, /CHROME_BIN/);
  assert.match(runner, /KK_CHROME_GPU_ARGS/);
  assert.match(runner, /--ignore-gpu-blocklist/);
  assert.match(runner, /--enable-gpu-rasterization/);
  assert.match(runner, /--disable-software-rasterizer/);

  assert.match(development, /fixed NVIDIA GPU/i);
  assert.match(development, /NVIDIA GeForce GTX 1650/);
  assert.doesNotMatch(development, /NVIDIA GPU acceleration can be used/);
});

test("hardware tuning is documented for local and release workflows", async () => {
  const [agents, development] = await Promise.all([
    readSource("../AGENTS.md"),
    readSource("../docs/DEVELOPMENT.md"),
  ]);

  for (const source of [agents, development]) {
    assert.match(source, /hardware-tuned/i);
    assert.match(source, /KK_CPU_MODE/);
    assert.match(source, /KK_MAX_WORKERS/);
    assert.match(source, /KK_DISABLE_NICE/);
  }

  assert.match(development, /AMD Ryzen 5 5600H/);
  assert.match(development, /12 logical/);
  assert.match(development, /does not change global CPU governors/i);
});
