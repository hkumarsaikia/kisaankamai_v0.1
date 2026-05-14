import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

test("Discord tooling supports env-driven multi-webhook channels", async () => {
  const discordLib = await import("../scripts/lib/discord.mjs");
  const notifySource = await readFile(new URL("../scripts/discord-webhook-notify.mjs", import.meta.url), "utf8");

  assert.deepEqual(
    Object.keys(discordLib.DISCORD_WEBHOOK_ENV_BY_CHANNEL).sort(),
    ["backend", "deploy", "github", "ops", "release", "security", "sentry"].sort()
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
      channel: "backend",
      env: { DISCORD_WEBHOOK_BACKEND_URL: "https://discord.example/backend" },
    }),
    "https://discord.example/backend"
  );
  assert.equal(
    discordLib.resolveDiscordWebhookUrl({
      channel: "github",
      env: { DISCORD_WEBHOOK_URL: "https://discord.example/default" },
    }),
    ""
  );
  assert.throws(
    () =>
      discordLib.resolveDiscordWebhookUrl({
        channel: "unknown",
        env: { DISCORD_WEBHOOK_URL: "https://discord.example/default" },
      }),
    /Unknown Discord notification channel/
  );
  assert.match(notifySource, /Named channels do not use DISCORD_WEBHOOK_URL fallback/);
  assert.doesNotMatch(notifySource, /process\.env\.DISCORD_WEBHOOK_URL \|\| ""/);
  assert.match(notifySource, /rawChannels\.length \? rawChannels : \["github"\]/);
  assert.match(notifySource, /allow-backend-channel/);
  assert.match(notifySource, /reserved for live website backend activity/);
  assert.match(notifySource, /--channel/);
  assert.match(notifySource, /sendDiscordWebhookToChannels/);
});

test("backend activity notifications are env-driven and never commit a real webhook", async () => {
  const [
    backendActivity,
    firebaseData,
    sessionRoute,
    loginRoute,
    localActions,
    docsSource,
    appHostingSource,
  ] = await Promise.all([
    readFile(new URL("../lib/server/backend-activity.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/server/firebase-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/server/firebase-session-route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/auth/login/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/actions/local-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../docs/OPERATIONS_LIVE_REPO_SYNC.md", import.meta.url), "utf8"),
    readFile(new URL("../apphosting.yaml", import.meta.url), "utf8"),
  ]);

  assert.match(backendActivity, /DISCORD_WEBHOOK_BACKEND_URL/);
  assert.match(backendActivity, /DISCORD_WEBHOOK_BACKEND_NOTIFICATION_URL/);
  assert.match(backendActivity, /BACKEND_DISCORD_TIMEOUT_MS\s*=\s*2200/);
  assert.match(backendActivity, /captureServerException/);
  assert.match(backendActivity, /EVENT_LABELS/);
  assert.match(backendActivity, /humanizeFieldName/);
  assert.match(backendActivity, /formatTechnicalId/);
  assert.match(backendActivity, /name:\s*"Activity"/);
  assert.match(backendActivity, /name:\s*"Account Ref"/);
  assert.match(backendActivity, /Request Details/);
  assert.doesNotMatch(backendActivity, /normalizeField\(\{ name: "Event"/);
  assert.doesNotMatch(backendActivity, /JSON\.stringify\(value, null, 2\)/);
  assert.match(firebaseData, /event:\s*"listing\.created"/);
  assert.match(firebaseData, /event:\s*"listing\.updated"/);
  assert.match(firebaseData, /event:\s*"listing\.deleted"/);
  assert.match(firebaseData, /event:\s*"booking\.created"/);
  assert.match(firebaseData, /event:\s*"booking\.status_updated"/);
  assert.match(firebaseData, /event:\s*"form\.submitted"/);
  assert.match(sessionRoute, /event:\s*"auth\.registered"/);
  assert.match(sessionRoute, /event:\s*"auth\.session_created"/);
  assert.match(loginRoute, /event:\s*"auth\.login"/);
  assert.match(localActions, /event:\s*"auth\.logout"/);
  assert.match(docsSource, /DISCORD_WEBHOOK_BACKEND_URL/);
  assert.match(docsSource, /Do not commit real webhook URLs/);
  assert.match(appHostingSource, /variable:\s*DISCORD_WEBHOOK_BACKEND_URL/);
  assert.match(appHostingSource, /secret:\s*discordWebhookBackendUrl/);
  assert.match(
    appHostingSource,
    /variable:\s*DISCORD_WEBHOOK_BACKEND_URL[\s\S]*availability:\s*\n\s*-\s*RUNTIME/
  );
  assert.doesNotMatch(
    `${backendActivity}\n${firebaseData}\n${sessionRoute}\n${loginRoute}\n${localActions}\n${docsSource}\n${appHostingSource}`,
    /discord\.com\/api\/webhooks/
  );
});

test("Firebase launch gate does not require Sentry", async () => {
  const [packageSource, appHostingSource, runnerSource, sheetsVerifySource] = await Promise.all([
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../apphosting.yaml", import.meta.url), "utf8"),
    readFile(new URL("../scripts/hardware-tuned-runner.mjs", import.meta.url), "utf8"),
    readFile(new URL("../scripts/google-sheets-verify.mjs", import.meta.url), "utf8"),
  ]);
  const packageJson = JSON.parse(packageSource);

  assert.equal(packageJson.scripts["firebase:preflight"], "node scripts/firebase-preflight.mjs");
  assert.equal(
    packageJson.scripts["firebase:rules:dry-run"],
    "firebase deploy --only firestore,storage --project gokisaan --dry-run --debug"
  );
  assert.equal(
    packageJson.scripts["launch:gate"],
    "node scripts/hardware-tuned-runner.mjs launch:gate"
  );
  assert.match(runnerSource, /runLaunchGate/);
  assert.match(runnerSource, /firebase-preflight\.mjs/);
  assert.match(runnerSource, /firestore,storage/);
  assert.match(runnerSource, /"--debug"/);
  assert.match(runnerSource, /google-sheets-verify\.mjs/);
  assert.match(sheetsVerifySource, /VERIFY_ATTEMPTS\s*=\s*3/);
  assert.match(sheetsVerifySource, /verifyWorkbookStructureWithRetry/);
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

test("browser automation stays dev-only and local credential guides are ignored", async () => {
  const [packageSource, gitignoreSource] = await Promise.all([
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../.gitignore", import.meta.url), "utf8"),
  ]);
  const packageJson = JSON.parse(packageSource);

  assert.equal(packageJson.dependencies.puppeteer, undefined);
  assert.match(packageJson.devDependencies.puppeteer, /^\^24\./);
  assert.match(gitignoreSource, /FINAL_TEST_ACCOUNT_LOGIN_GUIDE\.md/);
});

test("generated site-map artifacts are current and do not render raw template expressions", async () => {
  const [siteMapJsonSource, siteMapHtmlSource, generatorSource] = await Promise.all([
    readFile(new URL("../docs/site-map/site-map-data.json", import.meta.url), "utf8"),
    readFile(new URL("../docs/site-map/index.html", import.meta.url), "utf8"),
    readFile(new URL("../docs/site-map/generate-site-map.mjs", import.meta.url), "utf8"),
  ]);
  const siteMapData = JSON.parse(siteMapJsonSource);

  assert.doesNotMatch(siteMapJsonSource, /\$\{/);
  assert.doesNotMatch(siteMapHtmlSource, /\$\{/);
  assert.match(generatorSource, /normalizeExternalDestination/);
  assert.match(generatorSource, /dynamic-tel/);
  assert.equal(typeof siteMapData.generatedAt, "string");
  assert.ok(new Date(siteMapData.generatedAt).getTime() >= Date.UTC(2026, 4, 8));
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
