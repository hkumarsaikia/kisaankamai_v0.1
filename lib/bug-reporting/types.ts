import { z } from "zod";

export const bugSeveritySchema = z.enum(["fatal", "error", "warning", "info"]);
export const bugEnvironmentSchema = z.enum(["local", "live"]);
export const bugAccessSurfaceSchema = z.enum(["localhost", "lan", "public-tunnel", "custom-domain"]);
export const bugRuntimeSchema = z.enum(["client", "server", "process"]);
export const bugSourceSchema = z.enum([
  "window-error",
  "unhandledrejection",
  "console-error",
  "console-warn",
  "fetch-exception",
  "fetch-response",
  "web-vital",
  "route-error",
  "global-error",
  "api-route",
  "server-action",
  "process-uncaughtException",
  "process-unhandledRejection",
]);

export type BugSeverity = z.infer<typeof bugSeveritySchema>;
export type BugEnvironment = z.infer<typeof bugEnvironmentSchema>;
export type BugAccessSurface = z.infer<typeof bugAccessSurfaceSchema>;
export type BugRuntime = z.infer<typeof bugRuntimeSchema>;
export type BugReportSource = z.infer<typeof bugSourceSchema>;

export const bugErrorSchema = z
  .object({
    name: z.string().optional(),
    message: z.string().optional(),
    stack: z.string().optional(),
    cause: z.unknown().optional(),
    digest: z.string().optional(),
    componentStack: z.string().optional(),
  })
  .partial();

export const bugClientContextSchema = z
  .object({
    userAgent: z.string().optional(),
    browser: z.string().optional(),
    browserVersion: z.string().optional(),
    os: z.string().optional(),
    osVersion: z.string().optional(),
    deviceType: z.string().optional(),
    deviceVendor: z.string().optional(),
    deviceModel: z.string().optional(),
    viewport: z.string().optional(),
    language: z.string().optional(),
    online: z.boolean().optional(),
    referrer: z.string().optional(),
  })
  .partial();

export const bugPerformanceContextSchema = z
  .object({
    metricName: z.string().optional(),
    metricValue: z.number().optional(),
    rating: z.string().optional(),
    threshold: z.number().optional(),
    navigationType: z.string().optional(),
  })
  .partial();

export const bugReportRecordSchema = z.object({
  id: z.string(),
  occurredAt: z.string(),
  source: bugSourceSchema,
  severity: bugSeveritySchema,
  handled: z.boolean(),
  environment: bugEnvironmentSchema,
  accessSurface: bugAccessSurfaceSchema,
  runtime: bugRuntimeSchema,
  host: z.string().optional(),
  url: z.string().optional(),
  pathname: z.string().optional(),
  search: z.string().optional(),
  method: z.string().optional(),
  statusCode: z.number().int().optional(),
  requestId: z.string().optional(),
  clientSessionId: z.string().optional(),
  userId: z.string().optional(),
  userEmail: z.string().optional(),
  userPhone: z.string().optional(),
  activeWorkspace: z.string().optional(),
  rawQuery: z.unknown().optional(),
  rawBody: z.unknown().optional(),
  rawHeaders: z.unknown().optional(),
  rawResponsePreview: z.unknown().optional(),
  rawConsoleArgs: z.unknown().optional(),
  error: bugErrorSchema.optional(),
  client: bugClientContextSchema.optional(),
  performance: bugPerformanceContextSchema.optional(),
  buildTarget: z.string(),
  nodeEnv: z.string(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  truncated: z.boolean().optional(),
  truncationNotes: z.array(z.string()).optional(),
  fingerprint: z.string().optional(),
});

export type BugReportRecord = z.infer<typeof bugReportRecordSchema>;

export const clientBugEnvelopeSchema = z.object({
  source: bugSourceSchema,
  severity: bugSeveritySchema,
  handled: z.boolean().default(false),
  url: z.string().optional(),
  pathname: z.string().optional(),
  search: z.string().optional(),
  method: z.string().optional(),
  statusCode: z.number().int().optional(),
  clientSessionId: z.string().optional(),
  requestId: z.string().optional(),
  rawQuery: z.unknown().optional(),
  rawBody: z.unknown().optional(),
  rawHeaders: z.unknown().optional(),
  rawResponsePreview: z.unknown().optional(),
  rawConsoleArgs: z.unknown().optional(),
  error: bugErrorSchema.optional(),
  client: bugClientContextSchema.optional(),
  performance: bugPerformanceContextSchema.optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type ClientBugEnvelope = z.infer<typeof clientBugEnvelopeSchema>;
