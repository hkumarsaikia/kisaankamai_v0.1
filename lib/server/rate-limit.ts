import "server-only";

import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";
import { getAdminDb } from "@/lib/server/firebase-admin";
import { HttpError } from "@/lib/server/http";

const RATE_LIMITS_COLLECTION = "rate-limits";
const DEFAULT_RATE_LIMIT_MESSAGE = "Too many requests. Please wait and try again.";

export type RateLimitRule = {
  namespace: string;
  key?: string | null;
  limit: number;
  windowMs: number;
  message?: string;
};

const TEN_MINUTES_MS = 10 * 60 * 1000;
const THIRTY_MINUTES_MS = 30 * 60 * 1000;

function nowMs() {
  return Date.now();
}

function hashValue(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function normalizeKey(value?: string | null) {
  return (value || "").trim().toLowerCase();
}

function getForwardedIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim();
  }

  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    request.headers.get("fastly-client-ip") ||
    "unknown"
  );
}

export function clientIpRateKey(request: NextRequest) {
  return `ip:${normalizeKey(getForwardedIp(request)) || "unknown"}`;
}

export function identifierRateKey(kind: "email" | "phone" | "contact" | "user", value?: string | null) {
  const normalized = normalizeKey(value);
  if (!normalized) {
    return null;
  }

  return `${kind}:${normalized.replace(/\s+/g, "")}`;
}

function stringFromPayload(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  return null;
}

export function buildPublicFormRateLimitRules(
  request: NextRequest,
  namespace: string,
  payload?: Record<string, unknown>
): RateLimitRule[] {
  const phone =
    stringFromPayload(payload?.phone) ||
    stringFromPayload(payload?.mobileNumber) ||
    stringFromPayload(payload?.contact);
  const email = stringFromPayload(payload?.email);
  const contactKey =
    identifierRateKey("phone", phone) ||
    identifierRateKey("email", email) ||
    identifierRateKey("contact", stringFromPayload(payload?.fullName));

  return [
    {
      namespace: `${namespace}:ip`,
      key: clientIpRateKey(request),
      limit: 20,
      windowMs: TEN_MINUTES_MS,
    },
    {
      namespace: `${namespace}:contact`,
      key: contactKey,
      limit: 5,
      windowMs: TEN_MINUTES_MS,
    },
  ];
}

export function buildAuthRateLimitRules(
  request: NextRequest,
  namespace: string,
  identifier?: string | null,
  identifierLimit = 8
): RateLimitRule[] {
  return [
    {
      namespace: `${namespace}:ip`,
      key: clientIpRateKey(request),
      limit: 20,
      windowMs: TEN_MINUTES_MS,
    },
    {
      namespace: `${namespace}:identifier`,
      key: identifierRateKey("contact", identifier),
      limit: identifierLimit,
      windowMs: THIRTY_MINUTES_MS,
    },
  ];
}

export async function assertRateLimit(request: NextRequest, rules: RateLimitRule[]) {
  const activeRules = rules.filter((rule) => rule.limit > 0 && rule.windowMs > 0 && normalizeKey(rule.key));
  if (!activeRules.length) {
    return;
  }

  const database = getAdminDb();
  const currentMs = nowMs();

  for (const rule of activeRules) {
    const key = normalizeKey(rule.key);
    const windowStartMs = currentMs - (currentMs % rule.windowMs);
    const keyHash = hashValue(`${rule.namespace}:${key}`);
    const documentId = hashValue(`${rule.namespace}:${key}:${windowStartMs}`).slice(0, 64);
    const documentRef = database.collection(RATE_LIMITS_COLLECTION).doc(documentId);

    await database.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(documentRef);
      const previousCount = snapshot.exists ? Number(snapshot.data()?.count || 0) : 0;

      if (previousCount >= rule.limit) {
        throw new HttpError(429, rule.message || DEFAULT_RATE_LIMIT_MESSAGE);
      }

      transaction.set(
        documentRef,
        {
          namespace: rule.namespace,
          keyHash,
          count: previousCount + 1,
          limit: rule.limit,
          windowMs: rule.windowMs,
          windowStartMs,
          expiresAtMs: windowStartMs + rule.windowMs * 2,
          updatedAt: new Date(currentMs).toISOString(),
          path: request.nextUrl.pathname,
        },
        { merge: true }
      );
    });
  }
}
