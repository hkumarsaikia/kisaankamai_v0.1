import "server-only";

import { createHash, randomUUID } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { isIP } from "node:net";
import path from "node:path";
import type { NextRequest } from "next/server";
import { UAParser } from "ua-parser-js";
import stringify from "safe-stable-stringify";
import { serializeError } from "serialize-error";
import type { ZodTypeAny } from "zod";
import {
  bugReportRecordSchema,
  clientBugEnvelopeSchema,
  type BugAccessSurface,
  type BugEnvironment,
  type BugReportRecord,
  type BugReportSource,
  type BugRuntime,
  type BugSeverity,
  type ClientBugEnvelope,
} from "@/lib/bug-reporting/types";
import { getCurrentSession } from "@/lib/server/local-auth";
import { handleRouteError } from "@/lib/server/http";

const BUG_REPORTS_DIR = path.join(process.cwd(), "data", "bug-reports");
const MAX_STRING_LENGTH = 4_000;
const MAX_ARRAY_ITEMS = 50;
const MAX_OBJECT_KEYS = 100;
const MAX_DEPTH = 6;
const SOFT_EVENT_DEDUPE_WINDOW_MS = 5_000;

const bugGlobals = globalThis as typeof globalThis & {
  __kkBugReportQueue?: Promise<void>;
  __kkBugRecentFingerprints?: Map<string, number>;
  __kkBugProcessHandlersRegistered?: boolean;
};

if (!bugGlobals.__kkBugReportQueue) {
  bugGlobals.__kkBugReportQueue = Promise.resolve();
}

if (!bugGlobals.__kkBugRecentFingerprints) {
  bugGlobals.__kkBugRecentFingerprints = new Map();
}

function nowIso() {
  return new Date().toISOString();
}

function buildTarget() {
  return process.env.NEXT_PUBLIC_BUILD_TARGET || process.env.BUILD_TARGET || "server";
}

function nodeEnv() {
  return process.env.NODE_ENV || "development";
}

function normalizeHostname(input?: string | null) {
  if (!input) {
    return "";
  }

  const trimmed = input.trim();
  if (!trimmed) {
    return "";
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      return new URL(trimmed).hostname.toLowerCase();
    } catch {
      return trimmed.toLowerCase();
    }
  }

  if (trimmed.startsWith("[")) {
    const closingIndex = trimmed.indexOf("]");
    if (closingIndex > 0) {
      return trimmed.slice(1, closingIndex).toLowerCase();
    }
  }

  const colonCount = (trimmed.match(/:/g) || []).length;
  if (colonCount > 1) {
    return trimmed.toLowerCase();
  }

  return trimmed.split(":")[0].toLowerCase();
}

function isLoopbackHost(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

function isPrivateIpv4(hostname: string) {
  const parts = hostname.split(".").map((value) => Number.parseInt(value, 10));
  if (parts.length !== 4 || parts.some((value) => Number.isNaN(value))) {
    return false;
  }

  if (parts[0] === 10) {
    return true;
  }

  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) {
    return true;
  }

  return parts[0] === 192 && parts[1] === 168;
}

function classifyHost(hostname: string): {
  environment: BugEnvironment;
  accessSurface: BugAccessSurface;
} {
  const normalized = normalizeHostname(hostname);

  if (!normalized || isLoopbackHost(normalized)) {
    return {
      environment: "local",
      accessSurface: "localhost",
    };
  }

  if (normalized.endsWith(".trycloudflare.com")) {
    return {
      environment: "live",
      accessSurface: "public-tunnel",
    };
  }

  const ipKind = isIP(normalized);
  if (ipKind === 4 && isPrivateIpv4(normalized)) {
    return {
      environment: "live",
      accessSurface: "lan",
    };
  }

  if (ipKind === 6 && (normalized.startsWith("fc") || normalized.startsWith("fd"))) {
    return {
      environment: "live",
      accessSurface: "lan",
    };
  }

  return {
    environment: "live",
    accessSurface: "custom-domain",
  };
}

function sanitizeUndefined<T>(value: T) {
  return Object.fromEntries(
    Object.entries((value || {}) as Record<string, unknown>).filter(([, entry]) => entry !== undefined)
  ) as T;
}

function isFileLike(value: unknown): value is {
  name?: string;
  size?: number;
  type?: string;
  lastModified?: number;
} {
  return Boolean(
    value &&
      typeof value === "object" &&
      "size" in value &&
      "type" in value &&
      "name" in value
  );
}

function formDataToObject(formData: FormData) {
  const entries = new Map<string, unknown[]>();

  for (const [key, value] of formData.entries()) {
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

function toJsonCompatible(value: unknown): unknown {
  if (value instanceof Error) {
    return serializeError(value);
  }

  if (typeof FormData !== "undefined" && value instanceof FormData) {
    return formDataToObject(value);
  }

  if (typeof URLSearchParams !== "undefined" && value instanceof URLSearchParams) {
    return Object.fromEntries(value.entries());
  }

  if (typeof Headers !== "undefined" && value instanceof Headers) {
    return Object.fromEntries(value.entries());
  }

  if (isFileLike(value)) {
    return {
      name: value.name,
      size: value.size,
      type: value.type,
      lastModified: value.lastModified,
    };
  }

  if (value && typeof value === "object" && "buffer" in (value as Record<string, unknown>)) {
    return String(value);
  }

  try {
    const serialized = stringify(value);
    if (serialized === undefined) {
      return value === undefined ? null : String(value);
    }

    return JSON.parse(serialized);
  } catch {
    return String(value);
  }
}

function truncateValue(
  value: unknown,
  state: { truncated: boolean; notes: string[] },
  currentPath = "root",
  depth = 0
): unknown {
  if (value === null || value === undefined) {
    return value;
  }

  if (depth >= MAX_DEPTH) {
    state.truncated = true;
    state.notes.push(`${currentPath}: max depth ${MAX_DEPTH} reached`);
    return "[truncated-depth]";
  }

  if (typeof value === "string") {
    if (value.length <= MAX_STRING_LENGTH) {
      return value;
    }

    state.truncated = true;
    state.notes.push(`${currentPath}: string truncated from ${value.length} chars`);
    return `${value.slice(0, MAX_STRING_LENGTH)}…`;
  }

  if (Array.isArray(value)) {
    if (value.length <= MAX_ARRAY_ITEMS) {
      return value.map((entry, index) =>
        truncateValue(entry, state, `${currentPath}[${index}]`, depth + 1)
      );
    }

    state.truncated = true;
    state.notes.push(`${currentPath}: array truncated from ${value.length} items`);
    return [
      ...value.slice(0, MAX_ARRAY_ITEMS).map((entry, index) =>
        truncateValue(entry, state, `${currentPath}[${index}]`, depth + 1)
      ),
      { __truncated__: true, omittedItems: value.length - MAX_ARRAY_ITEMS },
    ];
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    const nextEntries = entries.slice(0, MAX_OBJECT_KEYS).map(([key, entry]) => [
      key,
      truncateValue(entry, state, `${currentPath}.${key}`, depth + 1),
    ]);

    if (entries.length > MAX_OBJECT_KEYS) {
      state.truncated = true;
      state.notes.push(`${currentPath}: object truncated from ${entries.length} keys`);
      nextEntries.push([
        "__truncated__",
        { omittedKeys: entries.length - MAX_OBJECT_KEYS },
      ]);
    }

    return Object.fromEntries(nextEntries);
  }

  return value;
}

function normalizeAndTruncateRecord(record: BugReportRecord) {
  const prepared = toJsonCompatible(record) as BugReportRecord;
  const state = {
    truncated: false,
    notes: [] as string[],
  };

  const truncatedRecord = truncateValue(prepared, state) as BugReportRecord;
  return {
    ...truncatedRecord,
    truncated: state.truncated || truncatedRecord.truncated,
    truncationNotes: state.notes.length
      ? [...(truncatedRecord.truncationNotes || []), ...state.notes]
      : truncatedRecord.truncationNotes,
  };
}

function createFingerprint(record: BugReportRecord) {
  const fingerprintBase = {
    source: record.source,
    severity: record.severity,
    runtime: record.runtime,
    pathname: record.pathname,
    statusCode: record.statusCode,
    message: record.error?.message,
    stack: record.error?.stack,
    rawConsoleArgs: record.rawConsoleArgs,
    performance: record.performance,
    metadata: record.metadata,
  };

  return createHash("sha1")
    .update(stringify(fingerprintBase) || "")
    .digest("hex");
}

function shouldDeduplicate(record: BugReportRecord) {
  return record.severity === "warning" || record.severity === "info";
}

function getDailyFilePath(occurredAt: string) {
  return path.join(BUG_REPORTS_DIR, `${occurredAt.slice(0, 10)}.json`);
}

async function ensureBugReportsDir() {
  await mkdir(BUG_REPORTS_DIR, { recursive: true });
}

function ensureBugReportsDirSync() {
  mkdirSync(BUG_REPORTS_DIR, { recursive: true });
}

async function readExistingReports(filePath: string) {
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readExistingReportsSync(filePath: string) {
  try {
    const raw = readFileSync(filePath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function shouldSkipRecentDuplicate(record: BugReportRecord) {
  if (!shouldDeduplicate(record)) {
    return false;
  }

  const recent = bugGlobals.__kkBugRecentFingerprints!;
  const fingerprint = record.fingerprint || createFingerprint(record);
  const now = Date.now();

  for (const [key, timestamp] of recent.entries()) {
    if (now - timestamp > SOFT_EVENT_DEDUPE_WINDOW_MS) {
      recent.delete(key);
    }
  }

  const lastSeen = recent.get(fingerprint);
  recent.set(fingerprint, now);
  return lastSeen !== undefined && now - lastSeen <= SOFT_EVENT_DEDUPE_WINDOW_MS;
}

async function writeReports(filePath: string, reports: unknown[]) {
  const tempPath = `${filePath}.${process.pid}.tmp`;
  await writeFile(tempPath, `${JSON.stringify(reports, null, 2)}\n`, "utf8");
  await rename(tempPath, filePath);
}

function writeReportsSync(filePath: string, reports: unknown[]) {
  const tempPath = `${filePath}.${process.pid}.tmp`;
  writeFileSync(tempPath, `${JSON.stringify(reports, null, 2)}\n`, "utf8");
  renameSync(tempPath, filePath);
}

function createRequestId() {
  return `req_${randomUUID().slice(0, 8)}`;
}

async function readRequestBodyPreview(requestClone?: Request | null) {
  if (!requestClone) {
    return undefined;
  }

  const method = requestClone.method.toUpperCase();
  if (method === "GET" || method === "HEAD") {
    return undefined;
  }

  const contentType = requestClone.headers.get("content-type") || "";

  try {
    const rawText = await requestClone.text();
    if (!rawText) {
      return undefined;
    }

    if (contentType.includes("application/json")) {
      try {
        return JSON.parse(rawText);
      } catch {
        return rawText;
      }
    }

    if (contentType.includes("application/x-www-form-urlencoded")) {
      return Object.fromEntries(new URLSearchParams(rawText).entries());
    }

    return rawText;
  } catch {
    return undefined;
  }
}

async function readResponsePreview(response: Response) {
  try {
    const contentType = response.headers.get("content-type") || "";
    const rawText = await response.clone().text();
    if (!rawText) {
      return undefined;
    }

    if (contentType.includes("application/json")) {
      try {
        return JSON.parse(rawText);
      } catch {
        return rawText;
      }
    }

    return rawText;
  } catch {
    return undefined;
  }
}

function buildClientContext(userAgent: string | undefined, extras?: ClientBugEnvelope["client"]) {
  const parser = new UAParser(userAgent || extras?.userAgent || "");
  const parsed = parser.getResult();

  return sanitizeUndefined({
    userAgent: extras?.userAgent || userAgent,
    browser: extras?.browser || parsed.browser.name,
    browserVersion: extras?.browserVersion || parsed.browser.version,
    os: extras?.os || parsed.os.name,
    osVersion: extras?.osVersion || parsed.os.version,
    deviceType: extras?.deviceType || parsed.device.type,
    deviceVendor: extras?.deviceVendor || parsed.device.vendor,
    deviceModel: extras?.deviceModel || parsed.device.model,
    viewport: extras?.viewport,
    language: extras?.language,
    online: extras?.online,
    referrer: extras?.referrer,
  });
}

function getDefaultEnvironment() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return classifyHost(siteUrl);
}

async function buildBaseRecord(input: {
  source: BugReportSource;
  severity: BugSeverity;
  handled: boolean;
  runtime: BugRuntime;
  request?: NextRequest;
  requestClone?: Request | null;
  url?: string;
  pathname?: string;
  search?: string;
  method?: string;
  statusCode?: number;
  requestId?: string;
  clientSessionId?: string;
  rawQuery?: unknown;
  rawBody?: unknown;
  rawHeaders?: unknown;
  rawResponsePreview?: unknown;
  rawConsoleArgs?: unknown;
  error?: unknown;
  performance?: ClientBugEnvelope["performance"];
  metadata?: Record<string, unknown>;
  client?: ClientBugEnvelope["client"];
}) {
  const session = await getCurrentSession().catch(() => null);
  const requestUrl = input.request?.nextUrl?.href;
  const url = input.url || requestUrl;
  const parsedUrl = url ? new URL(url, input.request?.nextUrl.origin || "http://localhost") : null;
  const host =
    parsedUrl?.hostname ||
    normalizeHostname(
      input.request?.headers.get("x-forwarded-host") || input.request?.headers.get("host")
    );
  const classified = classifyHost(host);
  const rawHeaders =
    input.rawHeaders ||
    (input.request ? Object.fromEntries(input.request.headers.entries()) : undefined);
  const rawQuery =
    input.rawQuery ||
    (parsedUrl ? Object.fromEntries(parsedUrl.searchParams.entries()) : undefined);
  const requestBody =
    input.rawBody !== undefined ? input.rawBody : await readRequestBodyPreview(input.requestClone);
  const userAgent =
    (typeof rawHeaders === "object" &&
    rawHeaders &&
    "user-agent" in (rawHeaders as Record<string, unknown>)
      ? String((rawHeaders as Record<string, unknown>)["user-agent"])
      : undefined) || input.client?.userAgent;

  const record: BugReportRecord = {
    id: `bug_${randomUUID().slice(0, 12)}`,
    occurredAt: nowIso(),
    source: input.source,
    severity: input.severity,
    handled: input.handled,
    environment: classified.environment,
    accessSurface: classified.accessSurface,
    runtime: input.runtime,
    host: host || undefined,
    url: url || undefined,
    pathname: input.pathname || parsedUrl?.pathname || input.request?.nextUrl.pathname,
    search: input.search || parsedUrl?.search || input.request?.nextUrl.search || undefined,
    method: input.method || input.request?.method,
    statusCode: input.statusCode,
    requestId: input.requestId || createRequestId(),
    clientSessionId: input.clientSessionId,
    userId: session?.user.id,
    userEmail: session?.user.email,
    userPhone: session?.user.phone,
    activeWorkspace: session?.activeWorkspace,
    rawQuery,
    rawBody: requestBody,
    rawHeaders,
    rawResponsePreview: input.rawResponsePreview,
    rawConsoleArgs: input.rawConsoleArgs,
    error: input.error ? (toJsonCompatible(input.error) as BugReportRecord["error"]) : undefined,
    client: buildClientContext(userAgent, input.client),
    performance: input.performance,
    buildTarget: buildTarget(),
    nodeEnv: nodeEnv(),
    metadata: input.metadata,
  };

  const normalized = normalizeAndTruncateRecord(record);
  const fingerprint = createFingerprint(normalized);
  return bugReportRecordSchema.parse({
    ...normalized,
    fingerprint,
  });
}

export async function appendBugReport(record: BugReportRecord) {
  const normalized = bugReportRecordSchema.parse(normalizeAndTruncateRecord(record));

  if (shouldSkipRecentDuplicate(normalized)) {
    return { skipped: true, id: normalized.id };
  }

  const filePath = getDailyFilePath(normalized.occurredAt);

  bugGlobals.__kkBugReportQueue = bugGlobals.__kkBugReportQueue!
    .catch(() => undefined)
    .then(async () => {
      await ensureBugReportsDir();
      const existing = await readExistingReports(filePath);
      await writeReports(filePath, [...existing, normalized]);
    });

  await bugGlobals.__kkBugReportQueue;
  return { skipped: false, id: normalized.id };
}

export function appendBugReportSync(record: BugReportRecord) {
  const normalized = bugReportRecordSchema.parse(normalizeAndTruncateRecord(record));

  if (shouldSkipRecentDuplicate(normalized)) {
    return { skipped: true, id: normalized.id };
  }

  ensureBugReportsDirSync();
  const filePath = getDailyFilePath(normalized.occurredAt);
  const existing = readExistingReportsSync(filePath);
  writeReportsSync(filePath, [...existing, normalized]);
  return { skipped: false, id: normalized.id };
}

export async function reportServerError(input: {
  source: BugReportSource;
  severity?: BugSeverity;
  handled?: boolean;
  request?: NextRequest;
  requestClone?: Request | null;
  url?: string;
  pathname?: string;
  search?: string;
  method?: string;
  statusCode?: number;
  rawQuery?: unknown;
  rawBody?: unknown;
  rawHeaders?: unknown;
  rawResponsePreview?: unknown;
  rawConsoleArgs?: unknown;
  error?: unknown;
  performance?: ClientBugEnvelope["performance"];
  metadata?: Record<string, unknown>;
  clientSessionId?: string;
}) {
  const record = await buildBaseRecord({
    ...input,
    severity: input.severity || "error",
    handled: input.handled ?? false,
    runtime: "server",
  });

  return appendBugReport(record);
}

export async function reportClientEnvelope(request: NextRequest, envelope: ClientBugEnvelope) {
  const parsed = clientBugEnvelopeSchema.parse(envelope);
  const record = await buildBaseRecord({
    ...parsed,
    runtime: "client",
    request,
  });
  return appendBugReport(record);
}

export async function reportProcessEvent(input: {
  source: "process-uncaughtException" | "process-unhandledRejection";
  error: unknown;
  metadata?: Record<string, unknown>;
}) {
  const classified = getDefaultEnvironment();
  const record = bugReportRecordSchema.parse(
    normalizeAndTruncateRecord({
      id: `bug_${randomUUID().slice(0, 12)}`,
      occurredAt: nowIso(),
      source: input.source,
      severity: "fatal",
      handled: false,
      environment: classified.environment,
      accessSurface: classified.accessSurface,
      runtime: "process",
      error: toJsonCompatible(input.error) as BugReportRecord["error"],
      buildTarget: buildTarget(),
      nodeEnv: nodeEnv(),
      metadata: input.metadata,
      requestId: createRequestId(),
    })
  );

  return appendBugReportSync({
    ...record,
    fingerprint: createFingerprint(record),
  });
}

export function registerProcessBugHandlers() {
  if (bugGlobals.__kkBugProcessHandlersRegistered) {
    return;
  }

  bugGlobals.__kkBugProcessHandlersRegistered = true;

  process.on("uncaughtException", (error) => {
    try {
      reportProcessEvent({
        source: "process-uncaughtException",
        error,
      });
    } catch {
      // ignore secondary failures
    }
  });

  process.on("unhandledRejection", (reason) => {
    try {
      reportProcessEvent({
        source: "process-unhandledRejection",
        error: reason instanceof Error ? reason : new Error(String(reason)),
        metadata: {
          rawReason: toJsonCompatible(reason),
        },
      });
    } catch {
      // ignore secondary failures
    }
  });
}

async function buildErrorResponsePreview(response: Response) {
  if (response.status < 400) {
    return undefined;
  }

  return readResponsePreview(response);
}

export function withLoggedRoute<TContext = unknown>(
  name: string,
  handler: (request: NextRequest, context: TContext) => Promise<Response>
) {
  return async (request: NextRequest, context: TContext) => {
    const requestClone = request.clone();

    try {
      const response = await handler(request, context);

      if (response.status >= 400 && request.nextUrl.pathname !== "/api/bug-reports") {
        await reportServerError({
          source: "api-route",
          severity: response.status >= 500 ? "error" : "warning",
          handled: true,
          request,
          requestClone,
          statusCode: response.status,
          rawResponsePreview: await buildErrorResponsePreview(response),
          metadata: {
            routeName: name,
          },
        });
      }

      return response;
    } catch (error) {
      const errorResponse = handleRouteError(error);

      if (request.nextUrl.pathname !== "/api/bug-reports") {
        await reportServerError({
          source: "api-route",
          severity: errorResponse.status >= 500 ? "fatal" : "warning",
          handled: errorResponse.status < 500,
          request,
          requestClone,
          statusCode: errorResponse.status,
          error,
          rawResponsePreview: await buildErrorResponsePreview(errorResponse),
          metadata: {
            routeName: name,
          },
        });
      }

      return errorResponse;
    }
  };
}

function isActionResult(value: unknown): value is { ok: boolean; error?: string; redirectTo?: string } {
  return Boolean(
    value &&
      typeof value === "object" &&
      "ok" in value &&
      typeof (value as { ok?: unknown }).ok === "boolean"
  );
}

function normalizeActionArgs(args: unknown[]) {
  if (args.length === 1) {
    return toJsonCompatible(args[0]);
  }

  return args.map((arg) => toJsonCompatible(arg));
}

export function withLoggedAction<TArgs extends unknown[], TResult>(
  name: string,
  action: (...args: TArgs) => Promise<TResult>,
  options?: {
    rawArgs?: unknown[];
  }
) {
  return async (...args: TArgs): Promise<TResult> => {
    const capturedArgs = options?.rawArgs ?? args;

    try {
      const result = await action(...args);

      if (isActionResult(result) && !result.ok) {
        await reportServerError({
          source: "server-action",
          severity: "warning",
          handled: true,
          rawBody: normalizeActionArgs(capturedArgs),
          statusCode: 400,
          metadata: {
            actionName: name,
            result: toJsonCompatible(result),
          },
        });
      }

      return result;
    } catch (error) {
      await reportServerError({
        source: "server-action",
        severity: "error",
        handled: false,
        rawBody: normalizeActionArgs(capturedArgs),
        statusCode: 500,
        error,
        metadata: {
          actionName: name,
        },
      });
      throw error;
    }
  };
}

export async function readClientEnvelopeFromRequest<T extends ZodTypeAny>(
  request: NextRequest,
  schema: T
) {
  const json = await request.json();
  return schema.parse(json);
}

export function bugReportsExistForToday() {
  const filePath = getDailyFilePath(nowIso());
  return existsSync(filePath);
}
