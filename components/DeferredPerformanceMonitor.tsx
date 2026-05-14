"use client";

import { useEffect, useState } from "react";

type PerformanceMonitorComponent = () => React.ReactElement | null;

function scheduleIdleWork(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const browserWindow = window as Window & {
    requestIdleCallback?: (handler: IdleRequestCallback, options?: IdleRequestOptions) => number;
    cancelIdleCallback?: (handle: number) => void;
  };

  if (browserWindow.requestIdleCallback && browserWindow.cancelIdleCallback) {
    const idleId = browserWindow.requestIdleCallback(callback, { timeout: 4000 });
    return () => browserWindow.cancelIdleCallback?.(idleId);
  }

  const timeoutId = window.setTimeout(callback, 1200);
  return () => window.clearTimeout(timeoutId);
}

export function DeferredPerformanceMonitor() {
  const [Monitor, setMonitor] = useState<PerformanceMonitorComponent | null>(null);

  useEffect(() => {
    let cancelled = false;

    const cancelIdleWork = scheduleIdleWork(() => {
      void import("@/components/PerformanceMonitor").then((module) => {
        if (!cancelled) {
          setMonitor(() => module.PerformanceMonitor);
        }
      });
    });

    return () => {
      cancelled = true;
      cancelIdleWork();
    };
  }, []);

  return Monitor ? <Monitor /> : null;
}
