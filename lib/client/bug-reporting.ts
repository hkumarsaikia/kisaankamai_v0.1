"use client";

import { useEffect } from "react";
import type { BugReportSource, BugSeverity, ClientBugEnvelope } from "@/lib/bug-reporting/types";

const BUG_REPORT_ENDPOINT = "/api/bug-reports";
const CLIENT_SESSION_STORAGE_KEY = "kisan-kamai-bug-client-session";
const CLIENT_REPORT_WINDOW_STORAGE_KEY = "kisan-kamai-bug-report-window";
const CLIENT_REPORT_MAX_PER_MINUTE = 4;
const CLIENT_REPORT_DEDUP_WINDOW_MS = 30_000;

const clientReportWindow = {
  startedAt: 0,
  count: 0,
  signatures: new Map<string, number>(),
};

function canUseBrowserApis() {
  return typeof window !== "undefined";
}

function currentUrl() {
  if (!canUseBrowserApis()) {
    return undefined;
  }

  return window.location.href;
}

export function getClientSessionId() {
  if (!canUseBrowserApis()) {
    return "server-render";
  }

  const existing = window.sessionStorage.getItem(CLIENT_SESSION_STORAGE_KEY);
  if (existing) {
    return existing;
  }

  const nextId = `client_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  window.sessionStorage.setItem(CLIENT_SESSION_STORAGE_KEY, nextId);
  return nextId;
}

function toSerializable(value: unknown): unknown {
  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack,
      cause: value.cause,
    };
  }

  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return String(value);
  }
}

function baseEnvelope(input: Partial<ClientBugEnvelope> & Pick<ClientBugEnvelope, "source" | "severity">): ClientBugEnvelope {
  if (!canUseBrowserApis()) {
    return {
      handled: input.handled ?? false,
      source: input.source,
      severity: input.severity,
    };
  }

  return {
    handled: input.handled ?? false,
    source: input.source,
    severity: input.severity,
    url: input.url || window.location.href,
    pathname: input.pathname || window.location.pathname,
    search: input.search || window.location.search,
    method: input.method,
    statusCode: input.statusCode,
    requestId: input.requestId,
    clientSessionId: input.clientSessionId || getClientSessionId(),
    rawQuery: input.rawQuery,
    rawBody: input.rawBody,
    rawHeaders: input.rawHeaders,
    rawResponsePreview: input.rawResponsePreview,
    rawConsoleArgs: input.rawConsoleArgs,
    error: input.error,
    performance: input.performance,
    metadata: input.metadata,
    client: {
      userAgent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      language: navigator.language,
      online: navigator.onLine,
      referrer: document.referrer || undefined,
      ...(input.client || {}),
    },
  };
}

function isInternalBugRoute(targetUrl: URL) {
  return targetUrl.pathname === BUG_REPORT_ENDPOINT;
}

function buildClientReportSignature(input: Partial<ClientBugEnvelope> & Pick<ClientBugEnvelope, "source" | "severity">) {
  return [
    input.source,
    input.severity,
    input.pathname || (canUseBrowserApis() ? window.location.pathname : ""),
    input.statusCode || "",
    input.performance?.metricName || "",
    input.error?.message || "",
    Array.isArray(input.rawConsoleArgs) ? input.rawConsoleArgs.map((item) => String(item)).join("|").slice(0, 160) : "",
  ].join(":");
}

function readStoredReportWindow(now: number) {
  if (!canUseBrowserApis()) {
    return;
  }

  try {
    const stored = window.localStorage.getItem(CLIENT_REPORT_WINDOW_STORAGE_KEY);
    if (!stored) {
      return;
    }

    const parsed = JSON.parse(stored) as {
      count?: unknown;
      signatures?: unknown;
      startedAt?: unknown;
    };
    const startedAt = typeof parsed.startedAt === "number" ? parsed.startedAt : 0;
    if (!startedAt || now - startedAt > 60_000) {
      return;
    }

    clientReportWindow.startedAt = startedAt;
    clientReportWindow.count = typeof parsed.count === "number" ? parsed.count : 0;
    clientReportWindow.signatures.clear();

    if (parsed.signatures && typeof parsed.signatures === "object" && !Array.isArray(parsed.signatures)) {
      Object.entries(parsed.signatures as Record<string, unknown>).forEach(([signature, lastSeenAt]) => {
        if (typeof lastSeenAt === "number" && now - lastSeenAt <= CLIENT_REPORT_DEDUP_WINDOW_MS) {
          clientReportWindow.signatures.set(signature, lastSeenAt);
        }
      });
    }
  } catch {
    // Storage can fail in private browsing or hardened browser modes.
  }
}

function writeStoredReportWindow() {
  if (!canUseBrowserApis()) {
    return;
  }

  try {
    const storedReportWindow = JSON.stringify({
      startedAt: clientReportWindow.startedAt,
      count: clientReportWindow.count,
      signatures: Object.fromEntries(clientReportWindow.signatures.entries()),
    });
    window.localStorage.setItem(CLIENT_REPORT_WINDOW_STORAGE_KEY, storedReportWindow);
  } catch {
    // Reporting should never fail the user-facing page.
  }
}

function shouldDispatchClientReport(input: Partial<ClientBugEnvelope> & Pick<ClientBugEnvelope, "source" | "severity">) {
  const now = Date.now();
  readStoredReportWindow(now);

  if (!clientReportWindow.startedAt || now - clientReportWindow.startedAt > 60_000) {
    clientReportWindow.startedAt = now;
    clientReportWindow.count = 0;
    clientReportWindow.signatures.clear();
  }

  for (const [signature, lastSeenAt] of clientReportWindow.signatures.entries()) {
    if (now - lastSeenAt > CLIENT_REPORT_DEDUP_WINDOW_MS) {
      clientReportWindow.signatures.delete(signature);
    }
  }

  if (clientReportWindow.count >= CLIENT_REPORT_MAX_PER_MINUTE) {
    writeStoredReportWindow();
    return false;
  }

  const signature = buildClientReportSignature(input);
  const lastSeenAt = clientReportWindow.signatures.get(signature);
  if (lastSeenAt && now - lastSeenAt < CLIENT_REPORT_DEDUP_WINDOW_MS) {
    writeStoredReportWindow();
    return false;
  }

  clientReportWindow.count += 1;
  clientReportWindow.signatures.set(signature, now);
  writeStoredReportWindow();
  return true;
}

function dispatchEnvelope(payload: ClientBugEnvelope) {
  const body = JSON.stringify(payload);

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon(BUG_REPORT_ENDPOINT, blob)) {
        return;
      }
    }
  } catch {
    // fallback to fetch below
  }

  void fetch(BUG_REPORT_ENDPOINT, {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    keepalive: true,
  }).catch(() => {
    // ignore reporting failures
  });
}

export function reportClientBug(input: Partial<ClientBugEnvelope> & Pick<ClientBugEnvelope, "source" | "severity">) {
  if (!canUseBrowserApis()) {
    return;
  }

  if (!shouldDispatchClientReport(input)) {
    return;
  }

  dispatchEnvelope(baseEnvelope(input));
}

export function reportClientError(
  error: Error & { digest?: string },
  options: {
    source: BugReportSource;
    handled?: boolean;
    severity?: BugSeverity;
    metadata?: Record<string, unknown>;
    componentStack?: string;
  }
) {
  reportClientBug({
    source: options.source,
    severity: options.severity || "error",
    handled: options.handled ?? true,
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
      digest: error.digest,
      componentStack: options.componentStack,
    },
    metadata: options.metadata,
  });
}

export function useReportedError(
  error: Error & { digest?: string },
  options: {
    source: BugReportSource;
    handled?: boolean;
    severity?: BugSeverity;
    metadata?: Record<string, unknown>;
    componentStack?: string;
  }
) {
  useEffect(() => {
    reportClientError(error, options);
  }, [error, options]);
}

export function resolveFetchUrl(input: RequestInfo | URL) {
  if (!canUseBrowserApis()) {
    return null;
  }

  try {
    if (typeof input === "string") {
      return new URL(input, window.location.href);
    }

    if (input instanceof URL) {
      return input;
    }

    return new URL(input.url, window.location.href);
  } catch {
    return null;
  }
}

export function previewRequestBody(body: BodyInit | null | undefined) {
  if (body === undefined || body === null) {
    return undefined;
  }

  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return body;
    }
  }

  if (body instanceof URLSearchParams) {
    return Object.fromEntries(body.entries());
  }

  if (body instanceof FormData) {
    const entries = new Map<string, unknown[]>();
    for (const [key, value] of body.entries()) {
      const nextValue =
        typeof value === "string"
          ? value
          : {
              name: value.name,
              size: value.size,
              type: value.type,
              lastModified: value.lastModified,
            };

      const current = entries.get(key) || [];
      current.push(nextValue);
      entries.set(key, current);
    }

    return Object.fromEntries(
      [...entries.entries()].map(([key, values]) => [key, values.length === 1 ? values[0] : values])
    );
  }

  if (body instanceof Blob) {
    return {
      type: body.type,
      size: body.size,
    };
  }

  return toSerializable(body);
}

export async function previewResponse(response: Response) {
  try {
    const cloned = response.clone();
    const contentType = cloned.headers.get("content-type") || "";
    const text = await cloned.text();

    if (!text) {
      return undefined;
    }

    if (contentType.includes("application/json")) {
      try {
        return JSON.parse(text);
      } catch {
        return text;
      }
    }

    return text;
  } catch {
    return undefined;
  }
}

export function normalizeConsoleArgs(args: unknown[]) {
  return args.map((arg) => toSerializable(arg));
}

export function currentPathMetadata() {
  return {
    url: currentUrl(),
    pathname: canUseBrowserApis() ? window.location.pathname : undefined,
    search: canUseBrowserApis() ? window.location.search : undefined,
    clientSessionId: getClientSessionId(),
  };
}

export { BUG_REPORT_ENDPOINT, isInternalBugRoute };
