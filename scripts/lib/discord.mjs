const STATUS_COLORS = {
  success: 0x137333,
  warning: 0x9c6500,
  error: 0xc5221f,
  info: 0x185abc,
};

export const DISCORD_WEBHOOK_ENV_BY_CHANNEL = {
  ops: "DISCORD_WEBHOOK_OPS_URL",
  deploy: "DISCORD_WEBHOOK_DEPLOY_URL",
  release: "DISCORD_WEBHOOK_RELEASE_URL",
  github: "DISCORD_WEBHOOK_GITHUB_URL",
  security: "DISCORD_WEBHOOK_SECURITY_URL",
  sentry: "DISCORD_WEBHOOK_SENTRY_URL",
};

export function normalizeDiscordChannels(channels = []) {
  const normalized = channels
    .flatMap((channel) => String(channel || "").split(","))
    .map((channel) => channel.trim().toLowerCase())
    .filter(Boolean);

  return normalized.length ? [...new Set(normalized)] : ["ops"];
}

export function getDiscordChannelEnvName(channel = "ops") {
  const envName = DISCORD_WEBHOOK_ENV_BY_CHANNEL[channel] || "";
  if (!envName) {
    throw new Error(
      `Unknown Discord notification channel "${channel}". Expected one of: ${Object.keys(
        DISCORD_WEBHOOK_ENV_BY_CHANNEL
      ).join(", ")}.`
    );
  }
  return envName;
}

export function resolveDiscordWebhookUrl({ channel = "ops", explicitUrl = "", env = process.env } = {}) {
  const envName = getDiscordChannelEnvName(channel);
  if (explicitUrl) {
    return explicitUrl;
  }
  return env[envName] || "";
}

export async function sendDiscordWebhook({
  webhookUrl,
  title,
  summary,
  status = "info",
  fields = [],
  link,
  content,
  payload,
}) {
  if (!webhookUrl) {
    throw new Error("Missing Discord webhook URL.");
  }

  const requestPayload =
    payload ||
    {
      content: content || undefined,
      embeds: [
        {
          title,
          description: summary,
          url: link || undefined,
          color: STATUS_COLORS[status] || STATUS_COLORS.info,
          fields: fields.map((field) => ({
            name: field.name,
            value: field.value,
            inline: Boolean(field.inline),
          })),
          timestamp: new Date().toISOString(),
        },
      ],
    };

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestPayload),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Discord webhook failed (${response.status}): ${text}`);
  }

  return true;
}

export async function sendDiscordWebhookToChannels({
  channels = ["ops"],
  webhookUrl = "",
  env = process.env,
  ...message
}) {
  const normalizedChannels = normalizeDiscordChannels(channels);
  const results = [];

  for (const channel of normalizedChannels) {
    const resolvedWebhookUrl = resolveDiscordWebhookUrl({
      channel,
      explicitUrl: webhookUrl,
      env,
    });

    if (!resolvedWebhookUrl) {
      throw new Error(
        `Missing Discord webhook URL for channel "${channel}". Set ${getDiscordChannelEnvName(
          channel
        )}, or pass --webhook-url for a one-off direct notification.`
      );
    }

    await sendDiscordWebhook({
      ...message,
      webhookUrl: resolvedWebhookUrl,
    });

    results.push(channel);
  }

  return results;
}
