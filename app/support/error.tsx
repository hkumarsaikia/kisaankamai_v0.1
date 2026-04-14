"use client";

import { useEffect } from "react";
import { reportClientError } from "@/lib/client/bug-reporting";

export default function SupportError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportClientError(error, {
      source: "route-error",
      severity: "error",
      handled: true,
      metadata: {
        route: "/support",
      },
    });
  }, [error]);

  return (
    <div className="mx-auto max-w-4xl rounded-3xl border border-red-200 bg-red-50 p-8 text-red-800">
      <h2 className="text-2xl font-black">Support Error</h2>
      <p className="mt-3 text-sm font-medium">
        {error.message || "We could not load the support experience right now."}
      </p>
      <button
        onClick={() => reset()}
        className="mt-6 rounded-xl bg-red-600 px-5 py-3 font-bold text-white"
      >
        Try Again
      </button>
    </div>
  );
}

