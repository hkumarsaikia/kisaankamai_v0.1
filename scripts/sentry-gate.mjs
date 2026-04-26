import { loadRepoEnv } from "./lib/env.mjs";

loadRepoEnv();

const REQUIRED_ENV = [
  "SENTRY_AUTH_TOKEN",
  "SENTRY_ORG",
  "SENTRY_PROJECT",
  "SENTRY_DSN",
  "NEXT_PUBLIC_SENTRY_DSN",
];

const missing = REQUIRED_ENV.filter((name) => !process.env[name]);

if (missing.length) {
  console.error(`Sentry launch gate failed. Missing: ${missing.join(", ")}`);
  process.exit(1);
}

console.log("Sentry launch gate passed: required Sentry env vars are present.");
