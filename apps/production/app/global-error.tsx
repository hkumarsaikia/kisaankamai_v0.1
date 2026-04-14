"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="max-w-xl rounded-[2rem] border border-slate-800 bg-slate-900 p-8 text-center shadow-2xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-brand-300">Production error boundary</p>
          <h1 className="mt-4 text-3xl font-black">Something went wrong</h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            The error has been captured for production diagnostics. You can retry the route or return to the homepage.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <button onClick={() => reset()} className="kk-button-primary">
              Retry
            </button>
            <a href="/" className="kk-button-secondary">
              Go home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
