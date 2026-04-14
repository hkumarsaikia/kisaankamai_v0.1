import "server-only";

import * as Sentry from "@sentry/nextjs";

export function captureServerException(error: unknown, context?: Record<string, unknown>) {
  if (process.env.SENTRY_DSN) {
    Sentry.captureException(error, {
      extra: context,
    });
    return;
  }

  console.error("Production app exception", error, context);
}
