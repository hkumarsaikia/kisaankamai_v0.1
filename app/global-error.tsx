"use client";

import { useEffect } from "react";
import { reportClientError } from "@/lib/client/bug-reporting";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportClientError(error, {
      source: "global-error",
      severity: "fatal",
      handled: true,
      metadata: {
        route: "global",
      },
    });
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-background px-6 py-24 text-on-surface">
        <div className="mx-auto max-w-3xl rounded-3xl border border-red-200 bg-white p-10 shadow-sm dark:border-red-900/40 dark:bg-slate-900">
          <h1 className="text-3xl font-black text-primary dark:text-emerald-50">
            Something went wrong across the app.
          </h1>
          <p className="mt-4 font-medium text-on-surface-variant dark:text-slate-400">
            {error.message || "A global error interrupted the application."}
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="mt-8 rounded-xl bg-primary px-6 py-3 font-black text-white dark:bg-emerald-700"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
