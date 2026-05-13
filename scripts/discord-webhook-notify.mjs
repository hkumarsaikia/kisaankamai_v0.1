import fs from "node:fs";
import { parseArgs, printUsage, getStringArrayOption, getStringOption } from "./lib/cli.mjs";
import { loadRepoEnv } from "./lib/env.mjs";
import { sendDiscordWebhookToChannels } from "./lib/discord.mjs";

const options = parseArgs();

if (options.help) {
  printUsage([
    "Usage: node scripts/discord-webhook-notify.mjs [--channel <ops|deploy|release|github|security|sentry|backend>] [--title <title>] [--summary <text>] [--status <info|success|warning|error>]",
    "       node scripts/discord-webhook-notify.mjs [--webhook-url <url>] --payload-file <path-to-json>",
    "",
    "Repeated fields are passed as --field Name=Value",
    "Repeated --channel or comma-separated channels send the same payload to multiple Discord webhooks.",
    "Channel env vars: DISCORD_WEBHOOK_OPS_URL, DISCORD_WEBHOOK_DEPLOY_URL, DISCORD_WEBHOOK_RELEASE_URL, DISCORD_WEBHOOK_GITHUB_URL, DISCORD_WEBHOOK_SECURITY_URL, DISCORD_WEBHOOK_SENTRY_URL, DISCORD_WEBHOOK_BACKEND_URL",
    "Named channels do not use DISCORD_WEBHOOK_URL fallback. Configure the channel env var, or pass --webhook-url for a one-off direct send.",
  ]);
  process.exit(0);
}

loadRepoEnv();

const webhookUrl = getStringOption(options, "webhook-url", "");
const channels = getStringArrayOption(options, "channel");
const payloadFile = getStringOption(options, "payload-file", "");
const payload = payloadFile ? JSON.parse(fs.readFileSync(payloadFile, "utf8")) : undefined;
const fields = getStringArrayOption(options, "field").map((entry) => {
  const [name, ...rest] = entry.split("=");
  return {
    name,
    value: rest.join("=") || "-",
    inline: false,
  };
});

const notifiedChannels = await sendDiscordWebhookToChannels({
  channels,
  webhookUrl,
  payload,
  title: getStringOption(options, "title", "Kisan Kamai Notification"),
  summary: getStringOption(options, "summary", ""),
  status: getStringOption(options, "status", "info"),
  link: getStringOption(options, "link", ""),
  content: getStringOption(options, "content", ""),
  fields,
});

console.log(`Discord webhook notification sent to: ${notifiedChannels.join(", ")}.`);
