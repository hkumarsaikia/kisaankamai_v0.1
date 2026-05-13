import "server-only";

import { captureServerException } from "@/lib/server/firebase-observability";

type BackendActivityField = {
  name: string;
  value?: unknown;
  inline?: boolean;
};

type BackendActivityInput = {
  event: string;
  title: string;
  summary?: string;
  actor?: {
    userId?: string;
    name?: string;
    phone?: string;
    email?: string;
  };
  fields?: BackendActivityField[];
  url?: string;
};

const BACKEND_DISCORD_TIMEOUT_MS = 2200;
const MAX_FIELD_VALUE_LENGTH = 900;
const MAX_SUMMARY_LENGTH = 1800;

function getBackendDiscordWebhookUrl() {
  return (
    process.env.DISCORD_WEBHOOK_BACKEND_URL ||
    process.env.DISCORD_WEBHOOK_BACKEND_NOTIFICATION_URL ||
    ""
  ).trim();
}

function stringifyDiscordValue(value: unknown) {
  if (value === undefined || value === null || value === "") {
    return "-";
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function truncate(value: string, maxLength: number) {
  return value.length > maxLength ? `${value.slice(0, maxLength - 1)}…` : value;
}

function normalizeField(field: BackendActivityField) {
  return {
    name: truncate(field.name || "Detail", 250),
    value: truncate(stringifyDiscordValue(field.value), MAX_FIELD_VALUE_LENGTH),
    inline: field.inline !== false,
  };
}

export async function notifyBackendActivity(input: BackendActivityInput) {
  const webhookUrl = getBackendDiscordWebhookUrl();
  if (!webhookUrl) {
    return false;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), BACKEND_DISCORD_TIMEOUT_MS);
  const actorFields: BackendActivityField[] = [
    { name: "User ID", value: input.actor?.userId, inline: true },
    { name: "Name", value: input.actor?.name, inline: true },
    { name: "Mobile", value: input.actor?.phone, inline: true },
    { name: "Email", value: input.actor?.email, inline: true },
  ].filter((field) => field.value !== undefined && field.value !== "");

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        username: "Kisan Kamai Backend",
        embeds: [
          {
            title: input.title,
            description: truncate(input.summary || `Backend activity: ${input.event}`, MAX_SUMMARY_LENGTH),
            url: input.url || undefined,
            color: 0x143b2e,
            fields: [
              normalizeField({ name: "Event", value: input.event, inline: true }),
              ...actorFields.map(normalizeField),
              ...(input.fields || []).map(normalizeField),
            ].slice(0, 25),
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });

    if (!response.ok) {
      const responseText = await response.text().catch(() => "");
      throw new Error(`Backend Discord webhook failed (${response.status}): ${responseText}`);
    }

    return true;
  } catch (error) {
    captureServerException(error, {
      subsystem: "backendDiscordNotification",
      event: input.event,
    });
    return false;
  } finally {
    clearTimeout(timeout);
  }
}
