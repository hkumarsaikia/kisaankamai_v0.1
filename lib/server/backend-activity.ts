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

const EVENT_LABELS: Record<string, string> = {
  "auth.login": "User login",
  "auth.logout": "User logout",
  "auth.registered": "New user registration",
  "auth.session_created": "Session created",
  "profile.updated": "Profile update",
  "listing.created": "Equipment listing created",
  "listing.updated": "Equipment listing updated",
  "listing.deleted": "Equipment listing deleted",
  "booking.created": "Booking request created",
  "booking.status_updated": "Booking status updated",
  "form.submitted": "Form submission received",
};

function getBackendDiscordWebhookUrl() {
  return (
    process.env.DISCORD_WEBHOOK_BACKEND_URL ||
    process.env.DISCORD_WEBHOOK_BACKEND_NOTIFICATION_URL ||
    ""
  ).trim();
}

function humanizeFieldName(name: string) {
  return name
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (match) => match.toUpperCase())
    .replace(/\bId\b/g, "ID")
    .trim();
}

function formatTechnicalId(value: unknown) {
  const normalized = String(value || "").trim();
  if (!normalized) {
    return "-";
  }

  return normalized.length > 14 ? `...${normalized.slice(-8)}` : normalized;
}

function formatEventLabel(event: string) {
  return EVENT_LABELS[event] || humanizeFieldName(event);
}

function stringifyDiscordValue(value: unknown): string {
  if (value === undefined || value === null || value === "") {
    return "-";
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    const rows = value
      .map((item) => stringifyDiscordValue(item))
      .filter((item) => item && item !== "-");
    return rows.length ? rows.join("\n") : "-";
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, nestedValue]) => nestedValue !== undefined && nestedValue !== null && nestedValue !== "")
      .map(([key, nestedValue]) => `${humanizeFieldName(key)}: ${stringifyDiscordValue(nestedValue)}`);

    return entries.length ? entries.join("\n") : "-";
  }

  return String(value);
}

function truncate(value: string, maxLength: number) {
  return value.length > maxLength ? `${value.slice(0, maxLength - 1)}…` : value;
}

function normalizeField(field: BackendActivityField) {
  const fieldName = field.name === "Payload" ? "Request Details" : field.name || "Detail";

  return {
    name: truncate(fieldName, 250),
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
    { name: "Account Ref", value: formatTechnicalId(input.actor?.userId), inline: true },
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
              normalizeField({ name: "Activity", value: formatEventLabel(input.event), inline: true }),
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
