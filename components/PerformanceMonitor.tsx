"use client";

import { useEffect } from "react";
import { onCLS, onFCP, onINP, onLCP, onTTFB } from "web-vitals";
import {
  BUG_REPORT_ENDPOINT,
  currentPathMetadata,
  isInternalBugRoute,
  normalizeConsoleArgs,
  previewRequestBody,
  previewResponse,
  reportClientBug,
  resolveFetchUrl,
} from "@/lib/client/bug-reporting";

const VITAL_THRESHOLDS = {
  CLS: 0.25,
  FCP: 3_000,
  INP: 500,
  LCP: 4_000,
  TTFB: 1_800,
} as const;

declare global {
  interface Window {
    __KK_BUG_MONITOR_INSTALLED__?: boolean;
  }
}

export function PerformanceMonitor() {
  useEffect(() => {
    if (typeof window === "undefined" || window.__KK_BUG_MONITOR_INSTALLED__) {
      return;
    }

    window.__KK_BUG_MONITOR_INSTALLED__ = true;

    const originalConsoleError = window.console.error.bind(window.console);
    const originalConsoleWarn = window.console.warn.bind(window.console);
    const originalFetch = window.fetch.bind(window);

    const handleWindowError = (event: ErrorEvent) => {
      reportClientBug({
        ...currentPathMetadata(),
        source: "window-error",
        severity: "error",
        handled: false,
        error: {
          name: event.error?.name || "Error",
          message: event.message,
          stack: event.error?.stack,
        },
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason =
        event.reason instanceof Error
          ? {
              name: event.reason.name,
              message: event.reason.message,
              stack: event.reason.stack,
            }
          : {
              name: "UnhandledRejection",
              message: String(event.reason),
            };

      reportClientBug({
        ...currentPathMetadata(),
        source: "unhandledrejection",
        severity: "error",
        handled: false,
        error: reason,
        metadata: {
          rawReason: event.reason,
        },
      });
    };

    window.console.error = (...args: Parameters<typeof console.error>) => {
      originalConsoleError(...args);
      reportClientBug({
        ...currentPathMetadata(),
        source: "console-error",
        severity: "warning",
        handled: true,
        rawConsoleArgs: normalizeConsoleArgs(args),
      });
    };

    window.console.warn = (...args: Parameters<typeof console.warn>) => {
      originalConsoleWarn(...args);
      reportClientBug({
        ...currentPathMetadata(),
        source: "console-warn",
        severity: "info",
        handled: true,
        rawConsoleArgs: normalizeConsoleArgs(args),
      });
    };

    const wrappedFetch: typeof window.fetch = async (input, init) => {
      const targetUrl = resolveFetchUrl(input);

      if (!targetUrl || isInternalBugRoute(targetUrl) || targetUrl.pathname === BUG_REPORT_ENDPOINT) {
        return originalFetch(input, init);
      }

      const requestBody =
        input instanceof Request ? undefined : previewRequestBody(init?.body);

      try {
        const response = await originalFetch(input, init);

        if (!response.ok) {
          reportClientBug({
            ...currentPathMetadata(),
            source: "fetch-response",
            severity: response.status >= 500 ? "error" : "warning",
            handled: true,
            method: init?.method || (input instanceof Request ? input.method : "GET"),
            statusCode: response.status,
            url: targetUrl.href,
            pathname: targetUrl.pathname,
            search: targetUrl.search,
            rawBody: requestBody,
            rawResponsePreview: await previewResponse(response),
            metadata: {
              statusText: response.statusText,
            },
          });
        }

        return response;
      } catch (error) {
        reportClientBug({
          ...currentPathMetadata(),
          source: "fetch-exception",
          severity: "error",
          handled: false,
          method: init?.method || (input instanceof Request ? input.method : "GET"),
          url: targetUrl.href,
          pathname: targetUrl.pathname,
          search: targetUrl.search,
          rawBody: requestBody,
          error:
            error instanceof Error
              ? {
                  name: error.name,
                  message: error.message,
                  stack: error.stack,
                }
              : {
                  name: "FetchError",
                  message: String(error),
                },
        });
        throw error;
      }
    };

    window.fetch = wrappedFetch;
    window.addEventListener("error", handleWindowError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    const logVital = (metric: {
      name: keyof typeof VITAL_THRESHOLDS;
      value: number;
      rating: "good" | "needs-improvement" | "poor";
      id: string;
      navigationType?: string;
    }) => {
      if (metric.rating === "good") {
        return;
      }

      reportClientBug({
        ...currentPathMetadata(),
        source: "web-vital",
        severity: metric.rating === "poor" ? "warning" : "info",
        handled: true,
        performance: {
          metricName: metric.name,
          metricValue: metric.value,
          rating: metric.rating,
          threshold: VITAL_THRESHOLDS[metric.name],
          navigationType: metric.navigationType,
        },
        metadata: {
          metricId: metric.id,
        },
      });
    };

    onLCP(logVital);
    onINP(logVital);
    onCLS(logVital);
    onFCP(logVital);
    onTTFB(logVital);

    return () => {
      window.console.error = originalConsoleError;
      window.console.warn = originalConsoleWarn;
      window.fetch = originalFetch;
      window.removeEventListener("error", handleWindowError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      window.__KK_BUG_MONITOR_INSTALLED__ = false;
    };
  }, []);

  return null;
}
