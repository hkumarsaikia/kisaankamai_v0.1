import fs from "node:fs";
import { parseArgs, printUsage, getStringArrayOption, getStringOption } from "./lib/cli.mjs";
import { loadRepoEnv } from "./lib/env.mjs";
import { sendDiscordWebhook } from "./lib/discord.mjs";

const options = parseArgs();

if (options.help) {
  printUsage([
    "Usage: node scripts/discord-webhook-notify.mjs [--webhook-url <url>] [--title <title>] [--summary <text>] [--status <info|success|warning|error>]",
    "       node scripts/discord-webhook-notify.mjs [--webhook-url <url>] --payload-file <path-to-json>",
    "",
    "Repeated fields are passed as --field Name=Value",
    "Fallback env var: DISCORD_WEBHOOK_URL",
  ]);
  process.exit(0);
}

loadRepoEnv();

const webhookUrl = getStringOption(options, "webhook-url", process.env.DISCORD_WEBHOOK_URL || "");
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

await sendDiscordWebhook({
  webhookUrl,
  payload,
  title: getStringOption(options, "title", "Kisan Kamai Notification"),
  summary: getStringOption(options, "summary", ""),
  status: getStringOption(options, "status", "info"),
  link: getStringOption(options, "link", ""),
  content: getStringOption(options, "content", ""),
  fields,
});

console.log("Discord webhook notification sent.");
