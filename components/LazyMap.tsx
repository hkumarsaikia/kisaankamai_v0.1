"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const DynamicMap = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
});

export interface LazyMapProps {
  center?: [number, number];
  zoom?: number;
  markers?: Array<{ lat: number; lng: number; label: string; sublabel?: string; color?: string }>;
  circles?: Array<{ lat: number; lng: number; radius: number; color?: string }>;
  height?: string;
  className?: string;
  showControls?: boolean;
  deferUntilVisible?: boolean;
}

function MapSkeleton({ className = "", height = "500px" }: { className?: string; height?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900/70 ${className}`}
      style={{ height, width: "100%" }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-transparent via-white/30 to-transparent dark:via-slate-700/20" />
      <div className="absolute left-6 top-6 h-12 w-40 rounded-2xl bg-white/80 dark:bg-slate-800/80" />
      <div className="absolute bottom-6 left-6 h-20 w-56 rounded-3xl bg-white/70 dark:bg-slate-800/70" />
    </div>
  );
}

export function LazyMap({
  deferUntilVisible = true,
  className,
  height,
  ...props
}: LazyMapProps) {
  const [shouldRender, setShouldRender] = useState(!deferUntilVisible);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const effectiveHeight = height || "500px";

  useEffect(() => {
    if (!deferUntilVisible || shouldRender || !containerRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "180px 0px",
        threshold: 0.1,
      }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [deferUntilVisible, shouldRender]);

  return (
    <div ref={containerRef} className="w-full" style={{ height: effectiveHeight, width: "100%" }}>
      {shouldRender ? (
        <DynamicMap {...props} className={className} height="100%" />
      ) : (
        <MapSkeleton className={className} height="100%" />
      )}
    </div>
  );
}
