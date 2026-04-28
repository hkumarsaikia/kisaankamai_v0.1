import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { z, ZodTypeAny } from "zod";

const MAX_JSON_BYTES = 64 * 1024;

class HttpError extends Error {
  status: number;
  fieldErrors?: Record<string, string[]>;

  constructor(status: number, message: string, fieldErrors?: Record<string, string[]>) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

function isLoopbackHostname(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

function parseOrigin(value?: string | null) {
  if (!value) {
    return null;
  }

  try {
    return new URL(value);
  } catch {
    return null;
  }
}

function areSameOriginForMutation(left: string, right: string) {
  const leftUrl = parseOrigin(left);
  const rightUrl = parseOrigin(right);
  if (!leftUrl || !rightUrl) {
    return false;
  }

  if (leftUrl.origin === rightUrl.origin) {
    return true;
  }

  return (
    leftUrl.protocol === rightUrl.protocol &&
    leftUrl.port === rightUrl.port &&
    isLoopbackHostname(leftUrl.hostname) &&
    isLoopbackHostname(rightUrl.hostname)
  );
}

function appendKnownSiteOriginVariants(origins: string[]) {
  const output = new Set<string>();

  for (const origin of origins) {
    const parsed = parseOrigin(origin);
    if (!parsed) {
      continue;
    }

    output.add(parsed.origin);

    const isApex = parsed.hostname === "kisankamai.com";
    const isWww = parsed.hostname === "www.kisankamai.com";
    if (isApex || isWww) {
      parsed.hostname = isApex ? "www.kisankamai.com" : "kisankamai.com";
      output.add(parsed.origin);
    }
  }

  return Array.from(output);
}

function getForwardedRequestOrigins(request: NextRequest) {
  const protocol =
    request.headers.get("x-forwarded-proto") ||
    request.nextUrl.protocol.replace(/:$/, "") ||
    "https";
  const hosts = [
    request.headers.get("host"),
    request.headers.get("x-forwarded-host"),
  ].filter((value): value is string => Boolean(value));

  return hosts.map((host) => `${protocol}://${host}`);
}

export function ensureSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) {
    return;
  }

  const allowedOrigins = appendKnownSiteOriginVariants(
    [
      request.nextUrl.origin,
      ...getForwardedRequestOrigins(request),
      process.env.NEXT_PUBLIC_SITE_URL,
      process.env.NEXT_PUBLIC_APP_URL,
    ].filter((value): value is string => Boolean(value))
  );

  if (!allowedOrigins.some((allowedOrigin) => areSameOriginForMutation(origin, allowedOrigin))) {
    throw new HttpError(403, "Cross-origin form submissions are not allowed.");
  }
}

export async function parseJsonBody<T extends ZodTypeAny>(request: NextRequest, schema: T) {
  ensureSameOrigin(request);

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new HttpError(415, "Expected application/json content type.");
  }

  const contentLength = Number(request.headers.get("content-length") || "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_JSON_BYTES) {
    throw new HttpError(413, "Request body is too large.");
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    throw new HttpError(400, "Malformed JSON payload.");
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    throw new HttpError(
      400,
      parsed.error.flatten().formErrors[0] || "Validation failed.",
      parsed.error.flatten().fieldErrors as Record<string, string[]>
    );
  }

  return parsed.data;
}

export function assertMutationRequestAllowed() {
  // Pass through if there's no actual check
}

export function compactRecord<T extends Record<string, unknown>>(record: T) {
  return Object.fromEntries(
    Object.entries(record).filter(([, value]) => value !== undefined && value !== null && value !== "")
  ) as T;
}

export function handleRouteError(error: unknown) {
  if (error instanceof HttpError) {
    return NextResponse.json(
      {
        ok: false,
        error: error.message,
        fieldErrors: error.fieldErrors || undefined,
      },
      { status: error.status }
    );
  }

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        ok: false,
        error: error.flatten().formErrors[0] || "Validation failed.",
        fieldErrors: error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const message = error instanceof Error ? error.message : "Unexpected server error.";
  return NextResponse.json({ ok: false, error: message }, { status: 500 });
}
