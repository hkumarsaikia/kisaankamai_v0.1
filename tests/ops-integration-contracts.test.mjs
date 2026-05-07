import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

test("Discord tooling supports env-driven multi-webhook channels", async () => {
  const discordLib = await import("../scripts/lib/discord.mjs");
  const notifySource = await readFile(new URL("../scripts/discord-webhook-notify.mjs", import.meta.url), "utf8");

  assert.deepEqual(
    Object.keys(discordLib.DISCORD_WEBHOOK_ENV_BY_CHANNEL).sort(),
    ["deploy", "github", "ops", "release", "security", "sentry"].sort()
  );
  assert.equal(
    discordLib.resolveDiscordWebhookUrl({
      channel: "security",
      env: { DISCORD_WEBHOOK_SECURITY_URL: "https://discord.example/security" },
    }),
    "https://discord.example/security"
  );
  assert.equal(
    discordLib.resolveDiscordWebhookUrl({
      channel: "unknown",
      env: { DISCORD_WEBHOOK_URL: "https://discord.example/default" },
    }),
    "https://discord.example/default"
  );
  assert.match(notifySource, /--channel/);
  assert.match(notifySource, /sendDiscordWebhookToChannels/);
});

test("Firebase launch gate does not require Sentry", async () => {
  const [packageSource, appHostingSource, runnerSource] = await Promise.all([
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../apphosting.yaml", import.meta.url), "utf8"),
    readFile(new URL("../scripts/hardware-tuned-runner.mjs", import.meta.url), "utf8"),
  ]);
  const packageJson = JSON.parse(packageSource);

  assert.equal(packageJson.scripts["firebase:preflight"], "node scripts/firebase-preflight.mjs");
  assert.equal(
    packageJson.scripts["firebase:rules:dry-run"],
    "firebase deploy --only firestore,storage --project gokisaan --dry-run"
  );
  assert.equal(
    packageJson.scripts["launch:gate"],
    "node scripts/hardware-tuned-runner.mjs launch:gate"
  );
  assert.match(runnerSource, /runLaunchGate/);
  assert.match(runnerSource, /firebase-preflight\.mjs/);
  assert.match(runnerSource, /firestore,storage/);
  assert.match(runnerSource, /google-sheets-verify\.mjs/);
  assert.equal(packageJson.scripts["sentry:gate"], undefined);
  assert.doesNotMatch(appHostingSource, /SENTRY_/);
  assert.doesNotMatch(appHostingSource, /sentryDsn|nextPublicSentryDsn|sentryAuthToken|sentryOrg|sentryProject/);
});

test("optional Sentry instrumentation remains non-blocking", async () => {
  const [instrumentationSource, clientSource, serverSource, nextConfigSource] = await Promise.all([
    readFile(new URL("../instrumentation.ts", import.meta.url), "utf8"),
    readFile(new URL("../instrumentation-client.ts", import.meta.url), "utf8"),
    readFile(new URL("../sentry.server.config.ts", import.meta.url), "utf8"),
    readFile(new URL("../next.config.mjs", import.meta.url), "utf8"),
  ]);

  assert.match(instrumentationSource, /sentry\.server\.config/);
  assert.match(instrumentationSource, /await import\("@\/lib\/server\/bug-reporting"\)/);
  assert.match(instrumentationSource, /onRequestError/);
  assert.match(instrumentationSource, /captureRequestError/);
  assert.doesNotMatch(instrumentationSource, /^import .*bug-reporting/m);
  assert.match(clientSource, /captureRouterTransitionStart/);
  assert.match(serverSource, /Sentry\.init/);
  assert.match(nextConfigSource, /withSentryConfig/);
  assert.match(nextConfigSource, /sentry\.io/);
  assert.match(nextConfigSource, /disable: !sentryBuildConfigured/);
  assert.doesNotMatch(nextConfigSource, /workerThreads:\s*true/);
  assert.doesNotMatch(nextConfigSource, /cpus:\s*12/);
});

test("Ubuntu project-local install policy is documented and npm cache is local", async () => {
  const [npmrcSource, setupSource, readmeSource] = await Promise.all([
    readFile(new URL("../.npmrc", import.meta.url), "utf8"),
    readFile(new URL("../docs/SETUP.md", import.meta.url), "utf8"),
    readFile(new URL("../README.md", import.meta.url), "utf8"),
  ]);

  assert.match(npmrcSource, /cache=\.cache\/npm/);
  assert.doesNotMatch(npmrcSource, /puppeteer_skip_download/);
  assert.match(setupSource, /Ubuntu 26\.04 LTS/);
  assert.match(setupSource, /PUPPETEER_SKIP_DOWNLOAD=true npm ci/);
  assert.match(setupSource, /PUPPETEER_EXECUTABLE_PATH=\/usr\/bin\/google-chrome/);
  assert.doesNotMatch(readmeSource, /old\/windows-root-reference/);
  assert.doesNotMatch(readmeSource, /old\/windows-local-artifacts/);
  assert.doesNotMatch(setupSource, /archived under `old\/`/);
  assert.doesNotMatch(readmeSource, /cross-agent:/);
});

test("Next 16 root app uses App Router-only Turbopack build and ESM configs", async () => {
  const [packageSource, buildSource, globalsSource, setupSource] = await Promise.all([
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../scripts/build-root.mjs", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../docs/SETUP.md", import.meta.url), "utf8"),
  ]);
  const packageJson = JSON.parse(packageSource);

  assert.equal(packageJson.type, "module");
  assert.match(packageJson.dependencies.next, /^\^16\./);
  assert.match(packageJson.dependencies.react, /^\^19\./);
  assert.match(packageJson.devDependencies.tailwindcss, /^\^4\./);
  assert.doesNotMatch(buildSource, /--webpack/);
  assert.match(globalsSource, /@import "tailwindcss"/);
  assert.match(globalsSource, /@config "\.\.\/tailwind\.config\.mjs"/);
  assert.match(setupSource, /Next\.js 16/);

  await assert.rejects(access(new URL("../pages/_app.tsx", import.meta.url)));
  await assert.rejects(access(new URL("../pages/_document.tsx", import.meta.url)));
});
