import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
    const { registerProcessBugHandlers } = await import("@/lib/server/bug-reporting");
    registerProcessBugHandlers();
  }
}

export const onRequestError = Sentry.captureRequestError;
