"use client";

import { useEffect, useRef } from "react";

const CHECK_INTERVAL_MS = 5 * 60 * 1000;
const BUILD_INFO_ENDPOINT = "/api/build-info";

declare global {
  interface Window {
    __KK_BUILD_FRESHNESS_MONITOR__?: string;
  }
}

type BuildFreshnessMonitorProps = {
  initialRevision: string;
};

export function BuildFreshnessMonitor({ initialRevision }: BuildFreshnessMonitorProps) {
  const checkingRef = useRef(false);

  useEffect(() => {
    if (!initialRevision || typeof window === "undefined") {
      return;
    }

    window.__KK_BUILD_FRESHNESS_MONITOR__ = initialRevision;

    const checkForFreshBuild = async () => {
      if (checkingRef.current || document.visibilityState === "hidden") {
        return;
      }

      checkingRef.current = true;

      try {
        const response = await fetch(`${BUILD_INFO_ENDPOINT}?ts=${Date.now()}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        });

        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as { revision?: string };
        const liveRevision = payload.revision?.trim();

        if (liveRevision && liveRevision !== initialRevision) {
          window.location.reload();
        }
      } catch {
        // Network errors should not interrupt active user work. The next focus,
        // visibility, or interval check will try again.
      } finally {
        checkingRef.current = false;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void checkForFreshBuild();
      }
    };

    window.addEventListener("focus", checkForFreshBuild);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    const intervalId = window.setInterval(checkForFreshBuild, CHECK_INTERVAL_MS);

    return () => {
      window.removeEventListener("focus", checkForFreshBuild);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.clearInterval(intervalId);
      if (window.__KK_BUILD_FRESHNESS_MONITOR__ === initialRevision) {
        delete window.__KK_BUILD_FRESHNESS_MONITOR__;
      }
    };
  }, [initialRevision]);

  return null;
}
