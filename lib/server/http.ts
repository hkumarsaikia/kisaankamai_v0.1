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

export function ensureSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) {
    return;
  }

  const allowedOrigins = [
    request.nextUrl.origin,
    process.env.NEXT_PUBLIC_SITE_URL,
  ].filter(Boolean);

  if (!allowedOrigins.includes(origin)) {
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
