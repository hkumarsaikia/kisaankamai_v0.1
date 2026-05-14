"use client";

import { usePathname } from "next/navigation";
import { PageViewTransition } from "@/components/PageViewTransition";
import { RouteTransitionShell } from "@/components/RouteTransitionShell";
import { shouldBypassRouteShell } from "@/lib/site-chrome-routes";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const exactBareRoute = shouldBypassRouteShell(pathname || "");
  const viewKey = pathname || "root";

  if (exactBareRoute) {
    return <PageViewTransition viewKey={viewKey}>{children}</PageViewTransition>;
  }

  return (
    <PageViewTransition viewKey={viewKey}>
      <RouteTransitionShell className="min-h-screen flex flex-col">{children}</RouteTransitionShell>
    </PageViewTransition>
  );
}
