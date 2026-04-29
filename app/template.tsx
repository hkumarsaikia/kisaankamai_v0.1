"use client";

import { usePathname } from "next/navigation";
import { RouteTransitionShell } from "@/components/RouteTransitionShell";
import { shouldBypassRouteShell } from "@/lib/site-chrome-routes";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const exactBareRoute = shouldBypassRouteShell(pathname || "");

  if (exactBareRoute) {
    return <>{children}</>;
  }

  return <RouteTransitionShell className="min-h-screen flex flex-col">{children}</RouteTransitionShell>;
}
