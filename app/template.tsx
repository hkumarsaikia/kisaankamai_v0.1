"use client";

import { usePathname } from "next/navigation";
import { RouteTransitionShell } from "@/components/RouteTransitionShell";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isProfileRoute =
    pathname?.startsWith("/owner-profile") ||
    pathname?.startsWith("/renter-profile") ||
    pathname?.startsWith("/owner-registration");

  return (
    <RouteTransitionShell className="min-h-screen flex flex-col" enabled={!isProfileRoute}>
      {children}
    </RouteTransitionShell>
  );
}

